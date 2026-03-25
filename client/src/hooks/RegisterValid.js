import { useMemo, useState, useEffect } from "react";
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
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const hasEmailError = email.trim() !== "" && !isEmailValid(email);
	const hasPasswordStrengthError = password.trim() !== "" && !isPasswordStrong(password);
	const hasPasswordConfirmError = confirmPassword.trim() !== "" && !isPasswordConfirmValid(password, confirmPassword);

	const isFormFilled = [nome, nickname, email, password, confirmPassword].every((field) => field.trim() !== "");
	const isFormValid = isFormFilled && !hasEmailError && !hasPasswordStrengthError && !hasPasswordConfirmError;

	// Limpar mensagens de sucesso após 5 segundos
	useEffect(() => {
		if (successMessage) {
			const timer = setTimeout(() => setSuccessMessage(""), 5000);
			return () => clearTimeout(timer);
		}
	}, [successMessage]);

	// Limpar mensagens de erro após 5 segundos
	useEffect(() => {
		if (errorMessage) {
			const timer = setTimeout(() => setErrorMessage(""), 5000);
			return () => clearTimeout(timer);
		}
	}, [errorMessage]);

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
			setErrorMessage("");
			await registerUser({ nome, nickname, email, password });
			setSuccessMessage("Registro realizado com sucesso! Você será redirecionado em breve.");
			// Limpar formulário após sucesso
			setTimeout(() => {
				setNome("");
				setNickname("");
				setEmail("");
				setPassword("");
				setConfirmPassword("");
			}, 2000);
		} catch (error) {
			setErrorMessage("Falha ao registrar. Tente novamente.");
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
		successMessage,
		errorMessage,
	};
}

