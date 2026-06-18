import 'package:flutter/foundation.dart';
import 'package:hr_mobile/data/models/absence_model.dart';
import 'package:hr_mobile/data/repositories/absence_repository.dart';

class AbsenceProvider extends ChangeNotifier {
  final AbsenceRepository _repository = AbsenceRepository();

  List<AbsenceModel> _absences = [];
  bool _isLoading = false;
  String? _error;

  List<AbsenceModel> get absences => _absences;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadAbsences({int? year, bool? justified}) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _absences = await _repository.getAbsences(year: year, justified: justified);
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> declareAbsence(Map<String, dynamic> data) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final absence = await _repository.declareAbsence(data);
      _absences.insert(0, absence);
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
}
