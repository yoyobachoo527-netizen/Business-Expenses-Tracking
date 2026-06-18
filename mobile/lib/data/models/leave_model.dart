import 'package:hr_mobile/core/constants/app_constants.dart';

class LeaveModel {
  final String id;
  final String type;
  final DateTime startDate;
  final DateTime endDate;
  final double daysCount;
  final String status;
  final String? reason;
  final String? managerComment;
  final DateTime createdAt;

  const LeaveModel({
    required this.id,
    required this.type,
    required this.startDate,
    required this.endDate,
    required this.daysCount,
    required this.status,
    this.reason,
    this.managerComment,
    required this.createdAt,
  });

  bool get isPending => status == 'pending';
  bool get isApproved => status == 'approved';
  bool get isRejected => status == 'rejected';
  bool get isCancelled => status == 'cancelled';

  String get typeLabel => AppConstants.leaveTypeLabels[type] ?? type;
  String get statusLabel => AppConstants.statusLabels[status] ?? status;

  factory LeaveModel.fromJson(Map<String, dynamic> json) {
    return LeaveModel(
      id: json['id']?.toString() ?? '',
      type: json['type'] ?? '',
      startDate: DateTime.tryParse(json['startDate']?.toString() ?? json['start_date']?.toString() ?? '') ?? DateTime.now(),
      endDate: DateTime.tryParse(json['endDate']?.toString() ?? json['end_date']?.toString() ?? '') ?? DateTime.now(),
      daysCount: (json['daysCount'] ?? json['days_count'] ?? 0).toDouble(),
      status: json['status'] ?? 'pending',
      reason: json['reason'],
      managerComment: json['managerComment'] ?? json['manager_comment'],
      createdAt: DateTime.tryParse(json['createdAt']?.toString() ?? json['created_at']?.toString() ?? '') ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'startDate': startDate.toIso8601String(),
      'endDate': endDate.toIso8601String(),
      'daysCount': daysCount,
      'status': status,
      'reason': reason,
      'managerComment': managerComment,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
