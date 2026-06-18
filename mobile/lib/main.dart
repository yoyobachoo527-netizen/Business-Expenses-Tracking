import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:hr_mobile/core/theme/app_theme.dart';
import 'package:hr_mobile/presentation/providers/auth_provider.dart';
import 'package:hr_mobile/presentation/providers/leave_provider.dart';
import 'package:hr_mobile/presentation/providers/absence_provider.dart';
import 'package:hr_mobile/presentation/providers/payslip_provider.dart';
import 'package:hr_mobile/routes/app_router.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('fr_FR', null);
  try {
    await Firebase.initializeApp();
  } catch (_) {}
  runApp(const HRApp());
}

class HRApp extends StatelessWidget {
  const HRApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()..checkAuthStatus()),
        ChangeNotifierProvider(create: (_) => LeaveProvider()),
        ChangeNotifierProvider(create: (_) => AbsenceProvider()),
        ChangeNotifierProvider(create: (_) => PaySlipProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          final router = AppRouter.createRouter(authProvider);
          return MaterialApp.router(
            title: 'Mon Espace RH',
            theme: AppTheme.light,
            routerConfig: router,
            locale: const Locale('fr', 'FR'),
            debugShowCheckedModeBanner: false,
          );
        },
      ),
    );
  }
}
