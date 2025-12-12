"""
Utility functions for converting categorical values to numerical scores.
"""

def convert_c1(value: str) -> int:
    """
    Convert skin type (c1) to numerical score.
    
    c1 (Skin Type):
    - Normal = 3
    - Kering = 2
    - Berminyak = 4
    - Kombinasi = 5
    """
    mapping = {
        "Normal": 3,
        "Kering": 2,
        "Berminyak": 4,
        "Kombinasi": 5
    }
    return mapping.get(value, 0)


def convert_c2(value: str) -> int:
    """
    Convert acne type (c2) to numerical score.
    
    c2 (Jenis Jerawat):
    - Komedo = 1
    - Papula = 2
    - Pustula = 3
    - Nodul = 4
    - Kistik = 5
    - Jerawat Jamur = 3
    """
    mapping = {
        "Komedo": 1,
        "Papula": 2,
        "Pustula": 3,
        "Nodul": 4,
        "Kistik": 5,
        "Jerawat Jamur": 3
    }
    return mapping.get(value, 0)


def convert_c3(value: str) -> int:
    """
    Convert severity (c3) to numerical score.
    
    c3 (Keparahan):
    - Ringan = 1
    - Sedang = 2
    - Berat = 3
    """
    mapping = {
        "Ringan": 1,
        "Sedang": 2,
        "Berat": 3
    }
    return mapping.get(value, 0)


def convert_score(value: str, criteria_type: str) -> float:
    """
    Generic function to convert categorical value to numerical score.
    
    Args:
        value: The categorical value to convert
        criteria_type: The type of criteria ('c1', 'c2', 'c3')
    
    Returns:
        Numerical score as float
    """
    if criteria_type == "c1":
        return float(convert_c1(value))
    elif criteria_type == "c2":
        return float(convert_c2(value))
    elif criteria_type == "c3":
        return float(convert_c3(value))
    else:
        return 0.0
