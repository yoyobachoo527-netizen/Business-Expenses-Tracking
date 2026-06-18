import 'package:flutter/foundation.dart';
import 'package:hr_mobile/data/models/payslip_model.dart';
import 'package:hr_mobile/data/repositories/payslip_repository.dart';

class PaySlipProvider extends ChangeNotifier {
  final PaySlipRepository _repository = PaySlipRepository();

  List<PaySlipModel> _payslips = [];
  bool _isLoading = false;
  String? _error;

  List<PaySlipModel> get payslips => _payslips;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadPaySlips() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _payslips = await _repository.getPaySlips();
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }
}
