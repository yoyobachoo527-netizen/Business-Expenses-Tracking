import 'package:hr_mobile/data/models/leave_model.dart';
import 'package:hr_mobile/data/models/leave_balance_model.dart';
import 'package:hr_mobile/data/services/api_service.dart';

class LeaveRepository {
  final ApiService _api = ApiService();

  Future<List<LeaveModel>> getLeaves({String? status, int? year}) async {
    final params = <String, String>{};
    if (status != null) params['status'] = status;
    if (year != null) params['year'] = year.toString();

    final query = params.isNotEmpty
        ? '?${params.entries.map((e) => '${e.key}=${e.value}').join('&')}'
        : '';

    final data = await _api.get('/leaves$query');
    final list = (data is List ? data : data['data'] ?? data['leaves'] ?? []) as List;
    return list.map((e) => LeaveModel.fromJson(e)).toList();
  }

  Future<List<LeaveBalanceModel>> getLeaveBalances() async {
    final data = await _api.get('/leaves/balances');
    final list = (data is List ? data : data['data'] ?? data['balances'] ?? []) as List;
    return list.map((e) => LeaveBalanceModel.fromJson(e)).toList();
  }

  Future<LeaveModel> createLeave(Map<String, dynamic> data) async {
    final response = await _api.post('/leaves', data);
    return LeaveModel.fromJson(response is Map ? response : response['leave']);
  }

  Future<LeaveModel> cancelLeave(String id) async {
    final response = await _api.put('/leaves/$id/cancel', {});
    return LeaveModel.fromJson(response is Map ? response : response['leave']);
  }
}
