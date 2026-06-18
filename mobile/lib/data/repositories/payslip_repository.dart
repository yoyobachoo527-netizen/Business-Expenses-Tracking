import 'dart:typed_data';
import 'package:hr_mobile/data/models/payslip_model.dart';
import 'package:hr_mobile/data/services/api_service.dart';

class PaySlipRepository {
  final ApiService _api = ApiService();

  Future<List<PaySlipModel>> getPaySlips() async {
    final data = await _api.get('/payslips');
    final list = (data is List ? data : data['data'] ?? data['payslips'] ?? []) as List;
    return list.map((e) => PaySlipModel.fromJson(e)).toList();
  }

  Future<PaySlipModel> getPaySlip(String id) async {
    final data = await _api.get('/payslips/$id');
    return PaySlipModel.fromJson(data);
  }

  Future<Uint8List> downloadPaySlip(String id) async {
    return _api.downloadFile('/payslips/$id/download');
  }
}
