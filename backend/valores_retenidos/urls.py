from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReporteFuncionarioViewSet, GradoListAPIView, ConceptoListAPIView, MotivoPagoListAPIView, CustomTokenObtainPairView
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

# ✅ NO AGREGUES 'api/' aquí
urlpatterns = [
    path('', include(router.urls)),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('grados/', GradoListAPIView.as_view(), name='grados-list'), 
    path('conceptos/', ConceptoListAPIView.as_view(), name='conceptos-list'),
    path('motivos-pago/', MotivoPagoListAPIView.as_view(), name='motivos-pago-list'),

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('me/', me_view, name='me')

]

