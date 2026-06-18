import 'package:flutter/foundation.dart';
import 'package:hr_mobile/data/models/leave_model.dart';
import 'package:hr_mobile/data/models/leave_balance_model.dart';
import 'package:hr_mobile/data/repositories/leave_repository.dart';

class LeaveProvider extends ChangeNotifier {
  final LeaveRepository _repository = LeaveRepository();

  List<LeaveModel> _leaves = [];
  List<LeaveBalanceModel> _balances = [];
  bool _isLoading = false;
  String? _error;

  List<LeaveModel> get leaves => _leaves;
  List<LeaveBalanceModel> get balances => _balances;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadLeaves({String? statusFilter}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _leaves = await _repository.getLeaves(status: statusFilter);
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> loadBalances() async {
    try {
      _balances = await _repository.getLeaveBalances();
      notifyListeners();
    } catch (e) {
      _error = e.toString();
      notifyListeners();
    }
  }

  Future<bool> createLeave(Map<String, dynamic> data) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final newLeave = await _repository.createLeave(data);
      _leaves.insert(0, newLeave);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> cancelLeave(String id) async {
    try {
      final updated = await _repository.cancelLeave(id);
      final index = _leaves.indexWhere((l) => l.id == id);
      if (index != -1) {
        _leaves[index] = updated;
      }
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }
}
