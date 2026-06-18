import 'package:flutter/material.dart';
import 'package:hr_mobile/core/theme/app_theme.dart';
import 'package:hr_mobile/data/models/leave_balance_model.dart';

class LeaveBalanceWidget extends StatelessWidget {
  final LeaveBalanceModel balance;

  const LeaveBalanceWidget({super.key, required this.balance});

  Color get _barColor {
    final percentRemaining = balance.total > 0 ? balance.remaining / balance.total : 0;
    if (percentRemaining > 0.5) return AppTheme.successColor;
    if (percentRemaining > 0.2) return AppTheme.warningColor;
    return AppTheme.errorColor;
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              balance.typeLabel,
              style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppTheme.primaryColor,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),
            Text(
              '${balance.remaining.toStringAsFixed(0)} / ${balance.total.toStringAsFixed(0)}',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: _barColor,
              ),
            ),
            const Text(
              'jours',
              style: TextStyle(fontSize: 11, color: Color(0xFF9E9E9E)),
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: balance.percentUsed.clamp(0.0, 1.0),
                backgroundColor: const Color(0xFFE0E0E0),
                valueColor: AlwaysStoppedAnimation<Color>(_barColor),
                minHeight: 6,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
