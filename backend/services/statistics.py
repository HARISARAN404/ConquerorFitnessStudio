from typing import Dict, List, Any
from datetime import datetime, timedelta
from .file_storage import FileStorageService

class StatisticsService:
    def __init__(self, storage: FileStorageService):
        self.storage = storage

    async def get_dashboard_stats(self) -> Dict[str, Any]:
        """Get comprehensive dashboard statistics"""
        members = await self.storage.read_json("members.json")
        attendance_data = await self.storage.read_json("attendance.json")

        total_members = len(members)
        active_members = len([m for m in members if m["paymentStatus"] == "paid"])

        # Get today's attendance
        today = datetime.now().strftime("%Y-%m-%d")
        today_attendance = attendance_data.get(today, {})
        present_today = len([member_id for member_id, present in today_attendance.items() if present])

        # Calculate revenue
        current_month = datetime.now().strftime("%Y-%m")
        monthly_revenue = sum([
            m["fees"] for m in members
            if m["lastPayment"].startswith(current_month)
        ])

        # Get overdue members
        overdue_count = len([m for m in members if m["paymentStatus"] == "overdue"])

        # New members this month
        new_members_count = len([
            m for m in members
            if m["joinDate"].startswith(current_month)
        ])

        return {
            "total_members": total_members,
            "active_members": active_members,
            "present_today": present_today,
            "absent_today": total_members - present_today,
            "monthly_revenue": monthly_revenue,
            "overdue_count": overdue_count,
            "new_members_count": new_members_count,
            "attendance_rate": round((present_today / total_members * 100) if total_members > 0 else 0, 1),
            "membership_distribution": self._get_plan_distribution(members),
            "revenue_trend": await self._get_revenue_trend()
        }

    async def get_monthly_report(self, year: int, month: int) -> Dict[str, Any]:
        """Generate comprehensive monthly report"""
        members = await self.storage.read_json("members.json")
        attendance_data = await self.storage.read_json("attendance.json")

        month_str = f"{year}-{month:02d}"
        days_in_month = self._get_days_in_month(year, month)

        # Calculate monthly metrics
        new_members = [m for m in members if m["joinDate"].startswith(month_str)]
        monthly_revenue = sum([m["fees"] for m in members if m["lastPayment"].startswith(month_str)])

        # Calculate attendance statistics
        attendance_summary = await self._calculate_monthly_attendance(year, month, attendance_data, members)

        return {
            "month": month_str,
            "total_members": len(members),
            "new_members": len(new_members),
            "monthly_revenue": monthly_revenue,
            "average_attendance_rate": attendance_summary["average_rate"],
            "total_attendance_days": attendance_summary["total_days"],
            "membership_plans": self._get_plan_distribution(members),
            "payment_status_breakdown": self._get_payment_status_breakdown(members),
            "daily_attendance": attendance_summary["daily_data"]
        }

    def _get_plan_distribution(self, members: List[Dict]) -> Dict[str, int]:
        """Get distribution of membership plans"""
        plans = {}
        for member in members:
            plan = member["plan"]
            plans[plan] = plans.get(plan, 0) + 1
        return plans

    def _get_payment_status_breakdown(self, members: List[Dict]) -> Dict[str, int]:
        """Get breakdown of payment statuses"""
        statuses = {}
        for member in members:
            status = member["paymentStatus"]
            statuses[status] = statuses.get(status, 0) + 1
        return statuses

    async def _get_revenue_trend(self, months: int = 6) -> List[Dict[str, Any]]:
        """Get revenue trend for last N months"""
        members = await self.storage.read_json("members.json")
        trend = []

        for i in range(months):
            month_date = datetime.now() - timedelta(days=30*i)
            month_str = month_date.strftime("%Y-%m")

            revenue = sum([
                m["fees"] for m in members
                if m["lastPayment"].startswith(month_str)
            ])

            trend.append({
                "month": month_str,
                "revenue": revenue
            })

        return list(reversed(trend))

    def _get_days_in_month(self, year: int, month: int) -> int:
        """Get number of days in a month"""
        if month == 12:
            return 31
        next_month = datetime(year, month + 1, 1)
        current_month = datetime(year, month, 1)
        return (next_month - current_month).days

    async def _calculate_monthly_attendance(self, year: int, month: int,
                                          attendance_data: Dict, members: List[Dict]) -> Dict[str, Any]:
        """Calculate attendance statistics for a month"""
        month_str = f"{year}-{month:02d}"
        daily_data = []
        total_present = 0
        total_possible = 0

        # Check each day of the month
        days_in_month = self._get_days_in_month(year, month)
        for day in range(1, days_in_month + 1):
            date_str = f"{month_str}-{day:02d}"
            day_attendance = attendance_data.get(date_str, {})

            present_count = len([member_id for member_id, present in day_attendance.items() if present])
            total_possible += len(members)
            total_present += present_count

            daily_data.append({
                "date": date_str,
                "present": present_count,
                "absent": len(members) - present_count,
                "rate": round((present_count / len(members) * 100) if members else 0, 1)
            })

        average_rate = round((total_present / total_possible * 100) if total_possible > 0 else 0, 1)

        return {
            "average_rate": average_rate,
            "total_days": days_in_month,
            "daily_data": daily_data
        }