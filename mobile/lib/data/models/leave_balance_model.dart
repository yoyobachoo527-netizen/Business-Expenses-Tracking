import 'package:hr_mobile/core/constants/app_constants.dart';

class LeaveBalanceModel {
  final String type;
  final double total;
  final double used;
  final double remaining;

  const LeaveBalanceModel({
    required this.type,
    required this.total,
    required this.used,
    required this.remaining,
  });

  double get percentUsed => total > 0 ? used / total : 0;
  String get typeLabel => AppConstants.leaveTypeLabels[type] ?? type;

  factory LeaveBalanceModel.fromJson(Map<String, dynamic> json) {
    return LeaveBalanceModel(
      type: json['type'] ?? '',
      total: (json['total'] ?? 0).toDouble(),
      used: (json['used'] ?? 0).toDouble(),
      remaining: (json['remaining'] ?? 0).toDouble(),
    );
  }
}
