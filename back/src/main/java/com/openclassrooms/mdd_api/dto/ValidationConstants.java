package com.openclassrooms.mdd_api.dto;

public final class ValidationConstants {

    public static final String PASSWORD_REGEXP =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#]).{8,}$";

    public static final String PASSWORD_MESSAGE =
            "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&#)";

    private ValidationConstants() {}
}
