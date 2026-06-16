package com.tiendaya.interfaces;

import com.tiendaya.dtos.LoginRequestDto;
import com.tiendaya.dtos.LoginResponseDto;

public interface IAuthService {

    LoginResponseDto login(LoginRequestDto dto);
}