from .models import ReporteFuncionario, Grado, Concepto, MotivoPago
from .serializers import ReporteFuncionarioSerializer, GradoSerializer, ConceptoSerializer, MotivoPagoSerializer, CustomTokenObtainPairSerializer
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import PerfilUsuario
from .serializers import PerfilUsuarioSerializer

import logging


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

