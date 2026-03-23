import { useMemo, useState } from "react";
import { registerUser } from "../services/api";
import { isEmailValid } from "../utils/utils";

function isPasswordStrong(passwordValue) {
	return passwordValue.trim().length >= 8;
}

function isPasswordConfirmValid(passwordValue, confirmPasswordValue) {
	return passwordValue === confirmPasswordValue;
}

export function useRegisterValid() {
	const [nome, setNome] = useState("");
	const [nickname, setNickname] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const hasEmailError = email.trim() !== "" && !isEmailValid(email);
	const hasPasswordStrengthError = password.trim() !== "" && !isPasswordStrong(password);
	const hasPasswordConfirmError = confirmPassword.trim() !== "" && !isPasswordConfirmValid(password, confirmPassword);

	const isFormFilled = [nome, nickname, email, password, confirmPassword].every((field) => field.trim() !== "");
	const isFormValid = isFormFilled && !hasEmailError && !hasPasswordStrengthError && !hasPasswordConfirmError;

	const priorityWarning = useMemo(() => {
		if (hasEmailError) {
			return "E-mail invalido: use apenas um @ e um dominio valido (ex: usuario@dominio.com).";
		}

		if (hasPasswordStrengthError) {
			return "Senha invalida: use pelo menos 8 caracteres.";
		}

		if (hasPasswordConfirmError) {
			return "As senhas nao coincidem.";
		}

		return "";
	}, [hasEmailError, hasPasswordStrengthError, hasPasswordConfirmError]);

	const handleRegister = async () => {
		if (!isFormValid || isSubmitting) {
			return;
		}

		try {
			setIsSubmitting(true);
			await registerUser({ nome, nickname, email, password });
			alert("Registro realizado com sucesso! Volte para a pagina de login para acessar sua conta.");
		} catch (error) {
			alert("Falha ao registrar. Tente novamente.");
			console.error("Register failed:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		nome, setNome,
		nickname, setNickname,
		email, setEmail,
		password, setPassword,
		confirmPassword, setConfirmPassword,
		hasEmailError,
		hasPasswordStrengthError,
		hasPasswordConfirmError,
		priorityWarning,
		isFormValid,
		isSubmitting,
		handleRegister,
	};
}

