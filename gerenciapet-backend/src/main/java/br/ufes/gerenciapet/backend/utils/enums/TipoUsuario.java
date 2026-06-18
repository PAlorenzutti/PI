package br.ufes.gerenciapet.backend.utils.enums;

/**
 * Tipos de usuário reconhecidos pelo sistema.
 */
public enum TipoUsuario {
    /** Usuário com permissões administrativas. */
    ADMIN,
    /** Tutor responsável por atividades ou grupos PET. */
    TUTOR,
    /** Extensionista vinculado a um grupo PET. */
    EXTENSIONISTA,
    /** Aluno participante dos eventos. */
    ALUNO
}
