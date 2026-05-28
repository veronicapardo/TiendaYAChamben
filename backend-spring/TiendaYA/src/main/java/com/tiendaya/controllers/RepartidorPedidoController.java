// com.tiendaya.controllers.RepartidorPedidoController.java
package com.tiendaya.controllers;

import com.tiendaya.dtos.PedidoResponseDto;
import com.tiendaya.dtos.PedidoDetalleResponseDto;
import com.tiendaya.models.Pedido;
import com.tiendaya.services.PedidoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/repartidor")
public class RepartidorPedidoController {

    private final PedidoService pedidoService;

    public RepartidorPedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @GetMapping("/{repartidorId}/pedidos")
    public ResponseEntity<List<PedidoResponseDto>> obtenerPedidosAsignados(@PathVariable Integer repartidorId) {
        List<Pedido> pedidos = pedidoService.getPedidosPorRepartidor(repartidorId);
        List<PedidoResponseDto> pedidosDto = pedidos.stream()
                .map(this::convertirAResponseDto)
                .toList();
        return ResponseEntity.ok(pedidosDto);
    }

    @GetMapping("/{repartidorId}/historial")
    public ResponseEntity<List<PedidoResponseDto>> obtenerHistorialRepartidor(
            @PathVariable Integer repartidorId
    ) {
        List<Pedido> pedidos = pedidoService.getHistorialPorRepartidor(repartidorId);

        List<PedidoResponseDto> pedidosDto = pedidos.stream()
                .map(this::convertirAResponseDto)
                .toList();

        return ResponseEntity.ok(pedidosDto);
    }

    private PedidoResponseDto convertirAResponseDto(Pedido pedido) {
        // Reutiliza la conversión que tienes en PedidoController
        // Puedes llamar a un método estático o copiar la lógica
        return new PedidoResponseDto(
                pedido.getId(),
                pedido.getCliente().getId(),
                pedido.getCliente().getNombre(),
                pedido.getCliente().getTelefono(),
                pedido.getRepartidor() != null ? pedido.getRepartidor().getId() : null,
                pedido.getRepartidor() != null ? pedido.getRepartidor().getNombre() : null,
                pedido.getFechaHora(),
                pedido.getDireccionEntrega(),
                pedido.getEstado(),
                pedido.getTotal(),
                pedido.getDetalles().stream()
                        .map(d -> new PedidoDetalleResponseDto(d.getId(), d.getProducto().getId(),
                                d.getProducto().getNombre(), d.getCantidad(), d.getPrecioUnitario(), d.getSubtotal()))
                        .toList(),
                pedido.getCreatedAt(),
                pedido.getUpdatedAt()
        );
    }
}