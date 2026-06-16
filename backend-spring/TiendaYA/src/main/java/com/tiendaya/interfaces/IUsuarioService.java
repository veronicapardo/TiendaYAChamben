package com.tiendaya.interfaces;

import com.tiendaya.dtos.CreateUsuarioDto;
import com.tiendaya.dtos.UpdateUsuarioDto;
import com.tiendaya.models.Usuario;

import java.util.List;
import java.util.Optional;

public interface IUsuarioService {

    List<Usuario> getUsuarios();

    Optional<Usuario> getUsuario(Integer id);

    Optional<Usuario> getUsuarioPorEmail(String email);

    Usuario createUsuario(CreateUsuarioDto dto);

    Optional<Usuario> updateUsuario(Integer id, UpdateUsuarioDto dto);

    Optional<Usuario> deleteUsuario(Integer id);
}