from typing import List, Dict

def validate_email_unique(email: str, members: List[Dict]) -> bool:
    """Check if email already exists among members"""
    return any(member.get("email", "").lower() == email.lower() for member in members)

def generate_member_id(members: List[Dict]) -> str:
    """Generate unique member ID in M001 format"""
    if not members:
        return "M001"

    # Find highest existing ID
    max_id = 0
    for member in members:
        if member["id"].startswith("M"):
            try:
                id_num = int(member["id"][1:])
                max_id = max(max_id, id_num)
            except ValueError:
                continue

    return f"M{(max_id + 1):03d}"

def validate_date_format(date_str: str) -> bool:
    """Validate date is in YYYY-MM-DD format"""
    try:
        from datetime import datetime
        datetime.strptime(date_str, "%Y-%m-%d")
        return True
    except ValueError:
        return False

def validate_phone_number(phone: str) -> bool:
    """Basic phone number validation"""
    import re
    # Remove any spaces, dashes, or parentheses
    clean_phone = re.sub(r'[\s\-\(\)]', '', phone)
    # Check if it's 10-15 digits and may start with +
    return re.match(r'^\+?\d{10,15}$', clean_phone) is not None