<<<<<<< HEAD
from .models import ReporteFuncionario, Grado, Concepto, MotivoPago
from .serializers import ReporteFuncionarioSerializer, GradoSerializer, ConceptoSerializer, MotivoPagoSerializer, CustomTokenObtainPairSerializer
=======
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
<<<<<<< HEAD
from .models import PerfilUsuario
from .serializers import PerfilUsuarioSerializer

import logging
=======
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet
import logging
from .models import Aplicacion, AccesoAplicacion, ReporteFuncionario, Grado, Concepto, MotivoPago, Funcionario, Rol
from .serializers import ReporteFuncionarioSerializer, GradoSerializer, ConceptoSerializer, MotivoPagoSerializer, CustomTokenObtainPairSerializer, FuncionarioPerfilSerializer, RolSerializer, AplicacionSerializer
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_view(request):
    user = request.user
    perfil = getattr(user, 'perfilusuario', None)
    funcionario = perfil.funcionario if perfil else None

    return Response({
        "username": user.username,
        "email": user.email,
        "funcionario": {
            "rut": funcionario.rut,
            "nombre": funcionario.nombre,
            "grado_id": funcionario.grado_id,
            # Agrega otros campos si deseas
        } if funcionario else None
    })

<<<<<<< HEAD
=======
class AplicacionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Catálogo de sub-sistemas (IDs numéricos).
    """
    queryset = Aplicacion.objects.all().order_by("nombre")
    serializer_class = AplicacionSerializer

    @action(detail=False, methods=["get"], url_path="by-rut")
    def by_rut(self, request):
        """
        GET /api/valores_retenidos/perfil/aplicaciones/by-rut/?rut=19.173.322-3
        Devuelve las aplicaciones a las que tiene acceso el RUT.
        """
        rut = (request.query_params.get("rut") or "").replace(".", "").replace("-", "").upper()
        if not rut:
            return Response({"detail": "Falta parámetro rut"}, status=status.HTTP_400_BAD_REQUEST)
            

        apps_qs = (
            Aplicacion.objects
            .filter(accesos__funcionario__rut=rut)  # AccesoAplicacion -> funcionario.rut
            .order_by("nombre")
            .distinct()
        )
        data = AplicacionSerializer(apps_qs, many=True).data
        return Response(data, status=status.HTTP_200_OK)
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)

#REPORTE FUNCIONARIO
class ReporteFuncionarioViewSet(viewsets.ModelViewSet):
    queryset = ReporteFuncionario.objects.all()
    serializer_class = ReporteFuncionarioSerializer

    def create(self, request, *args, **kwargs):
        try:
            print("==== DATA ENVIADA DESDE EL FRONTEND ====")
            print(request.data)
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            ingreso = serializer.save()

            return Response({
                'message': 'Ingreso guardado exitosamente',
                'id': ingreso.id_reporte_funcionario,
                'rut_funcionario': ingreso.funcionario.rut,
                'fecha_ingreso': ingreso.fecha_creacion
            })


        except Exception as e:
            #logger.exception("Error al guardar ingreso de funcionario")
            return Response({
                'message': 'Error al guardar ingreso',
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#LISTA DE GRADO
class GradoListAPIView(generics.ListAPIView):
    queryset = Grado.objects.all().order_by('id_grado')
    serializer_class = GradoSerializer

#LISTA DE CONCEPTOS
class ConceptoListAPIView(generics.ListAPIView):
    queryset = Concepto.objects.all().order_by('id_concepto')
    serializer_class = ConceptoSerializer

#LISTA DE MOTIVO DE PAGO
class MotivoPagoListAPIView(generics.ListAPIView):
    queryset = MotivoPago.objects.all().order_by('id_motivopago')
    serializer_class = MotivoPagoSerializer

#TOKEN LOGIN
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

<<<<<<< HEAD
=======
class PerfilFuncionarioViewSet(viewsets.ModelViewSet):
    """
    Endpoints para la pantalla Perfilamiento:
      - GET    /api/perfil/funcionarios/by-rut/?rut=19.173.322-3
      - POST   /api/perfil/funcionarios/          (crea o actualiza si existe)
      - PATCH  /api/perfil/funcionarios/{rut}/
      - DELETE /api/perfil/funcionarios/{rut}/
      - GET    /api/perfil/funcionarios/{rut}/apps/      (lista IDs de apps)
      - POST   /api/perfil/funcionarios/{rut}/apps/      (reemplaza IDs de apps)
    """
    serializer_class = FuncionarioPerfilSerializer
    lookup_field = "rut"

    def get_queryset(self):
        # Puedes dejar este filtro si quieres ocultar no perfilados en list(),
        # PERO by_rut usa get_object_or_404 y no depende de este queryset.
        return (
            Funcionario.objects
            .select_related("rol", "grado")
            .filter(rol__isnull=False)
            .exclude(area_trabajo__isnull=True)
            .exclude(area_trabajo="")
        )

    @action(detail=False, methods=["get"], url_path="by-rut")
    def by_rut(self, request):
        """
        Devuelve datos del funcionario + apps (IDs) a partir del RUT.
        """
        rut = (request.query_params.get("rut") or "").replace(".", "").replace("-", "").upper()
        if not rut:
            return Response({"detail": "Falta parámetro rut"}, status=status.HTTP_400_BAD_REQUEST)
        f = get_object_or_404(Funcionario, rut=rut)
        data = self.get_serializer(f).data
        # ← añade IDs numéricos de aplicaciones asignadas
        data["apps"] = list(
            Aplicacion.objects.filter(accesos__funcionario=f).values_list("id_aplicacion", flat=True)
        )
        return Response(data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["get"], url_path="apps")
    def apps(self, request, rut=None):
        """
        Lista los IDs de aplicaciones asignadas a un RUT.
        """
        f = get_object_or_404(Funcionario, rut=rut)
        ids = list(
            Aplicacion.objects.filter(accesos__funcionario=f).values_list("id_aplicacion", flat=True)
        )
        return Response({"rut": rut, "apps": ids}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="apps")
    def set_apps(self, request, rut=None):
        """
        Reemplaza los accesos de un funcionario.
        Body: { "apps": [1, 2] }   # 1 = Valores Retenidos, 2 = Desahucio, etc.
        """
        f = get_object_or_404(Funcionario, rut=rut)
        ids = request.data.get("apps", [])
        if not isinstance(ids, list):
            return Response({"detail": "apps debe ser una lista de enteros"}, status=400)

        # Valida y obtiene las apps
        apps = list(Aplicacion.objects.filter(id_aplicacion__in=ids))

        # Borra accesos no incluidos
        AccesoAplicacion.objects.filter(funcionario=f).exclude(aplicacion__in=apps).delete()

        # Crea los faltantes
        for app in apps:
            AccesoAplicacion.objects.get_or_create(funcionario=f, aplicacion=app)

        # Devuelve estado actual
        current_ids = list(
            Aplicacion.objects.filter(accesos__funcionario=f).values_list("id_aplicacion", flat=True)
        )
        return Response({"rut": rut, "apps": current_ids}, status=status.HTTP_200_OK)



class PerfilRolViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Rol.objects.all().order_by("nombre_rol")
    serializer_class = RolSerializer
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
