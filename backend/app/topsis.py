"""
TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) implementation.
"""

import math
from typing import List, Dict, Any
from .database import get_db
from .utils import convert_c1, convert_c2, convert_c3


def hitung_topsis(c1_user: str, c2_user: str, c3_user: str) -> List[Dict[str, Any]]:
    """
    Calculate TOPSIS score for all kandungan (products) based on user input.
    """
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    try:
        # Step 1: Fetch all kandungan from database
        cursor.execute("SELECT id, nama_kandungan, deskripsi, c1, c2, c3, c4 FROM kandungan")
        kandungan_list = cursor.fetchall()
        
        if not kandungan_list:
            return []
        
        # Step 2: Fetch kriteria (bobot dan jenis)
        cursor.execute("SELECT kode, bobot, tipe FROM kriteria ORDER BY kode")
        kriteria_list = cursor.fetchall()
        
        # Create mapping
        kriteria_map = {}
        bobot_array = []
        for k in kriteria_list:
            kriteria_map[k['kode']] = k['tipe']
            bobot_array.append(float(k['bobot']))
        
        # Step 3: Convert user input to scores
        user_scores = [
            float(convert_c1(c1_user)),
            float(convert_c2(c2_user)),
            float(convert_c3(c3_user))
        ]
        
        # Build decision matrix
        decision_matrix = []
        for kandungan in kandungan_list:
            row = [
                float(convert_c1(kandungan['c1'])),
                float(convert_c2(kandungan['c2'])),
                float(convert_c3(kandungan['c3'])),
                float(kandungan['c4']) if kandungan['c4'] else 0.0
            ]
            decision_matrix.append(row)
        
        # Step 4: Normalize
        normalized_matrix = normalize_matrix(decision_matrix)
        
        # Step 5: Weighted matrix
        weighted_matrix = []
        for row in normalized_matrix:
            weighted_row = [row[i] * bobot_array[i] for i in range(len(row))]
            weighted_matrix.append(weighted_row)
        
        # Step 6: Ideal positive & negative
        num_criteria = len(weighted_matrix[0])
        ideal_positive = []
        ideal_negative = []
        
        for j in range(num_criteria):
            col_values = [weighted_matrix[i][j] for i in range(len(weighted_matrix))]
            
            criteria_key = f"C{j+1}"
            criteria_type = kriteria_map.get(criteria_key, "benefit")
            
            if criteria_type == "benefit":
                ideal_positive.append(max(col_values))
                ideal_negative.append(min(col_values))
            else:
                ideal_positive.append(min(col_values))
                ideal_negative.append(max(col_values))
        
        # Step 7 - 8: Calculate distances & preference value
        results = []
        
        for i, kandungan in enumerate(kandungan_list):
            d_plus = math.sqrt(sum((weighted_matrix[i][j] - ideal_positive[j]) ** 2
                                   for j in range(num_criteria)))
            d_minus = math.sqrt(sum((weighted_matrix[i][j] - ideal_negative[j]) ** 2
                                    for j in range(num_criteria)))
            
            v_score = 0.0 if d_plus + d_minus == 0 else d_minus / (d_plus + d_minus)
            
            # FIXED PART ————————————————
            results.append({
                'id': kandungan['id'],
                'nama': kandungan['nama_kandungan'],
                'deskripsi': kandungan['deskripsi'],
                'c1': kandungan['c1'],
                'c2': kandungan['c2'],
                'c3': kandungan['c3'],
                'c4': kandungan['c4'],
                'skor': round(v_score, 4),
                'd_plus': round(d_plus, 4),
                'd_minus': round(d_minus, 4)
            })
            # ——————————————— END FIX
        
        # Step 9: Sort
        results.sort(key=lambda x: x['skor'], reverse=True)
        
        # Add ranking
        for rank, result in enumerate(results, 1):
            result['rank'] = rank
        
        return results
        
    except Exception as e:
        print(f"Error in TOPSIS calculation: {e}")
        raise e
    finally:
        cursor.close()
        db.close()


def normalize_matrix(matrix: List[List[float]]) -> List[List[float]]:
    """
    Normalize decision matrix using vector normalization.
    """
    if not matrix or not matrix[0]:
        return matrix
    
    num_rows = len(matrix)
    num_cols = len(matrix[0])
    
    normalized = []
    
    for j in range(num_cols):
        col_sum_squared = sum(matrix[i][j] ** 2 for i in range(num_rows))
        col_norm = math.sqrt(col_sum_squared)
        if col_norm == 0:
            col_norm = 1
        
        for i in range(num_rows):
            if j == 0:
                normalized.append([])
            normalized[i].append(matrix[i][j] / col_norm)
    
    return normalized
