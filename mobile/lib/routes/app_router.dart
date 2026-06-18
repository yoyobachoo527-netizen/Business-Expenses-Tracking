import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:hr_mobile/presentation/providers/auth_provider.dart';
import 'package:hr_mobile/presentation/screens/auth/login_screen.dart';
import 'package:hr_mobile/presentation/screens/dashboard/dashboard_screen.dart';
import 'package:hr_mobile/presentation/screens/leaves/leaves_screen.dart';
import 'package:hr_mobile/presentation/screens/leaves/leave_request_screen.dart';
import 'package:hr_mobile/presentation/screens/absences/absences_screen.dart';
import 'package:hr_mobile/presentation/screens/payslips/payslips_screen.dart';

class AppRouter {
  static GoRouter createRouter(AuthProvider authProvider) {
    return GoRouter(
      initialLocation: '/login',
      refreshListenable: authProvider,
      redirect: (context, state) {
        final isAuthenticated = authProvider.isAuthenticated;
        final isLoading = authProvider.status == AuthStatus.initial ||
            authProvider.status == AuthStatus.loading;

        if (isLoading) return null;

        final isLoginRoute = state.matchedLocation == '/login';

        if (!isAuthenticated && !isLoginRoute) {
          return '/login';
        }

        if (isAuthenticated && isLoginRoute) {
          return '/dashboard';
        }

        return null;
      },
      routes: [
        GoRoute(
          path: '/login',
          name: 'login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: '/dashboard',
          name: 'dashboard',
          builder: (context, state) => const DashboardScreen(),
        ),
        GoRoute(
          path: '/leaves',
          name: 'leaves',
          builder: (context, state) => const LeavesScreen(),
        ),
        GoRoute(
          path: '/leaves/new',
          name: 'leaves-new',
          builder: (context, state) => const LeaveRequestScreen(),
        ),
        GoRoute(
          path: '/absences',
          name: 'absences',
          builder: (context, state) => const AbsencesScreen(),
        ),
        GoRoute(
          path: '/payslips',
          name: 'payslips',
          builder: (context, state) => const PaySlipsScreen(),
        ),
      ],
    );
  }
}
