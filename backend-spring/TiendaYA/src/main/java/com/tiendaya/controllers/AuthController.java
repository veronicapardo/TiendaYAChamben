package com.tiendaya.controllers;

import com.tiendaya.dtos.LoginRequestDto;
import com.tiendaya.dtos.LoginResponseDto;
import com.tiendaya.dtos.MessageDto;
import com.tiendaya.interfaces.IAuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    private final IAuthService authService;

    public AuthController(IAuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDto dto) {
        try {
            LoginResponseDto response = authService.login(dto);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException error) {
            return ResponseEntity.badRequest().body(new MessageDto(error.getMessage()));
        }
    }
}