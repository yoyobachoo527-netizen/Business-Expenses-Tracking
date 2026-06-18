import 'package:hr_mobile/data/models/absence_model.dart';
import 'package:hr_mobile/data/services/api_service.dart';

class AbsenceRepository {
  final ApiService _api = ApiService();

  Future<List<AbsenceModel>> getAbsences({int? year, bool? justified}) async {
    final params = <String, String>{};
    if (year != null) params['year'] = year.toString();
    if (justified != null) params['justified'] = justified.toString();

    final query = params.isNotEmpty
        ? '?${params.entries.map((e) => '${e.key}=${e.value}').join('&')}'
        : '';

    final data = await _api.get('/absences$query');
    final list = (data is List ? data : data['data'] ?? data['absences'] ?? []) as List;
    return list.map((e) => AbsenceModel.fromJson(e)).toList();
  }

  Future<AbsenceModel> declareAbsence(Map<String, dynamic> data) async {
    final response = await _api.post('/absences', data);
    return AbsenceModel.fromJson(response is Map ? response : response['absence']);
  }
}
