import { useMemo, useState, useEffect } from "react";
import { registerUser, checkEmailAvailability, checkNicknameAvailability } from "../services/api";
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

	// Estados para verificação em tempo real
	const [isCheckingEmail, setIsCheckingEmail] = useState(false);
	const [isCheckingNickname, setIsCheckingNickname] = useState(false);
	const [emailAvailable, setEmailAvailable] = useState(null);
	const [nicknameAvailable, setNicknameAvailable] = useState(null);

	const hasEmailError = email.trim() !== "" && !isEmailValid(email);
	const hasPasswordStrengthError = password.trim() !== "" && !isPasswordStrong(password);
	const hasPasswordConfirmError = confirmPassword.trim() !== "" && !isPasswordConfirmValid(password, confirmPassword);

	// Verificar email em tempo real (com debounce)
	useEffect(() => {
		if (!email.trim() || !isEmailValid(email)) {
			setEmailAvailable(null);
			setIsCheckingEmail(false);
			return;
		}

		setIsCheckingEmail(true);
		const timer = setTimeout(async () => {
			try {
				const response = await checkEmailAvailability(email);
				setEmailAvailable(!response.data.exists);
			} catch (error) {
				console.error("Erro ao verificar email:", error);
				setEmailAvailable(null);
			} finally {
				setIsCheckingEmail(false);
			}
		}, 500); // 500ms debounce

		return () => clearTimeout(timer);
	}, [email]);

	// Verificar nickname em tempo real (com debounce)
	useEffect(() => {
		if (!nickname.trim()) {
			setNicknameAvailable(null);
			setIsCheckingNickname(false);
			return;
		}

		setIsCheckingNickname(true);
		const timer = setTimeout(async () => {
			try {
				const response = await checkNicknameAvailability(nickname);
				setNicknameAvailable(!response.data.exists);
			} catch (error) {
				console.error("Erro ao verificar nickname:", error);
				setNicknameAvailable(null);
			} finally {
				setIsCheckingNickname(false);
			}
		}, 500); // 500ms debounce

		return () => clearTimeout(timer);
	}, [nickname]);

	const isFormFilled = [nome, nickname, email, password, confirmPassword].every((field) => field.trim() !== "");
	const isFormValid = isFormFilled && 
		!hasEmailError && 
		!hasPasswordStrengthError && 
		!hasPasswordConfirmError &&
		emailAvailable === true &&
		nicknameAvailable === true;

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
		if (emailAvailable === false && isEmailValid(email)) {
			return "Este e-mail já está registrado.";
		}

		if (nicknameAvailable === false) {
			return "Este nickname já está em uso.";
		}

		if (hasEmailError) {
			return "E-mail inválido: use apenas um @ e um domínio válido (ex: usuario@dominio.com).";
		}

		if (hasPasswordStrengthError) {
			return "Senha inválida: use pelo menos 8 caracteres.";
		}

		if (hasPasswordConfirmError) {
			return "As senhas não coincidem.";
		}

		return "";
	}, [hasEmailError, hasPasswordStrengthError, hasPasswordConfirmError, emailAvailable, nicknameAvailable, email]);

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
				setEmailAvailable(null);
				setNicknameAvailable(null);
			}, 2000);
		} catch (error) {
			// Tratamento de erros específicos do servidor
			const errorMessageText = error.response?.data?.error || "Falha ao registrar. Tente novamente.";
			
			if (errorMessageText.toLowerCase().includes("email")) {
				setErrorMessage("Este email já está cadastrado.");
			} else if (errorMessageText.toLowerCase().includes("nickname")) {
				setErrorMessage("Este nickname já está em uso.");
			} else {
				setErrorMessage(errorMessageText);
			}
			
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
		isCheckingEmail,
		isCheckingNickname,
		emailAvailable,
		nicknameAvailable,
	};
}

