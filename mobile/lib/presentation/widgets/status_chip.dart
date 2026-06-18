import 'package:flutter/material.dart';
import 'package:hr_mobile/core/constants/app_constants.dart';
import 'package:hr_mobile/core/theme/app_theme.dart';

class StatusChip extends StatelessWidget {
  final String status;

  const StatusChip({super.key, required this.status});

  Color get _backgroundColor {
    switch (status) {
      case 'pending':
        return AppTheme.warningColor.withOpacity(0.15);
      case 'approved':
        return AppTheme.successColor.withOpacity(0.15);
      case 'rejected':
        return AppTheme.errorColor.withOpacity(0.15);
      case 'cancelled':
        return Colors.grey.withOpacity(0.15);
      default:
        return Colors.grey.withOpacity(0.15);
    }
  }

  Color get _textColor {
    switch (status) {
      case 'pending':
        return AppTheme.warningColor;
      case 'approved':
        return AppTheme.successColor;
      case 'rejected':
        return AppTheme.errorColor;
      case 'cancelled':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final label = AppConstants.statusLabels[status] ?? status;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: _backgroundColor,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: _textColor,
        ),
      ),
    );
  }
}
