from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AplicacionViewSet, me_view, ReporteFuncionarioViewSet, GradoListAPIView, ConceptoListAPIView, MotivoPagoListAPIView, CustomTokenObtainPairView, PerfilRolViewSet, PerfilFuncionarioViewSet
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .views import me_view

# Swagger config
schema_view = get_schema_view(
    openapi.Info(
        title="API Ingresos de Funcionarios",
        default_version='v1',
        description="Documentación automática con Swagger para la API de ingresos",
        contact=openapi.Contact(email="soporte@carabineros.cl"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

# Router
router = DefaultRouter()
router.register(r'ingresos', ReporteFuncionarioViewSet, basename='ingresos')

router.register(r'roles', PerfilRolViewSet, basename='roles')
# ⬇️ Alineado con el servicio Angular:
router.register(r'perfil/funcionarios', PerfilFuncionarioViewSet, basename='perfil-funcionarios')
router.register(r'perfil/roles',        PerfilRolViewSet,        basename='perfil-roles')
router.register(r'perfil/aplicaciones', AplicacionViewSet,       basename='perfil-aplicaciones')


# ✅ NO AGREGUES 'api/' aquí
urlpatterns = [
    path('', include(router.urls)),

    # Catálogos ya existentes
    path('grados/', GradoListAPIView.as_view(), name='grados-list'), 
    path('conceptos/', ConceptoListAPIView.as_view(), name='conceptos-list'),
    path('motivos-pago/', MotivoPagoListAPIView.as_view(), name='motivos-pago-list'),

<<<<<<< HEAD
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('me/', me_view, name='me')
=======
    # Auth / utilitarios
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('me/', me_view, name='me'),

    # Swagger
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui')


>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)

]

