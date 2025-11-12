console.log('JS carregado e DOM pronto');
console.log('supabase está definido?', typeof supabase !== 'undefined');

const supabaseUrl = 'https://xidgnqczmmbhekkraxwc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpZGducWN6bW1iaGVra3JheHdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMzUyMDEsImV4cCI6MjA3MDYxMTIwMX0.wTqBrB9JafzdLQa7_RIGAn5CSFulhPTjrBQEMp0lNuk';

const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

// =================== MODAL DE E-MAIL JÁ CADASTRADO ===================
function showEmailExistsModal() {
  const modal = document.getElementById('email-exists-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}
function closeEmailExistsModal() {
  const modal = document.getElementById('email-exists-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}
document.getElementById('email-exists-close')?.addEventListener('click', closeEmailExistsModal);
document.getElementById('email-exists-close-btn')?.addEventListener('click', closeEmailExistsModal);
// =====================================================================

// =================== BARRA DE PROGRESSO DINÂMICA ===================
const campos = [
  'nome', 'email', 'telefone', 'cpf', 'dataNascimento', 'empresa', 'cnpj', 'estado', 'senha', 'confirmarSenha', 'termos'
];

function atualizarProgresso() {
  let preenchidos = 0;
  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el && ((el.type === 'checkbox' && el.checked) || (el.value && el.value.trim().length > 0))) {
      preenchidos++;
    }
  });
  const percent = Math.round((preenchidos / campos.length) * 100);
  document.getElementById('progress-bar').style.width = percent + '%';
}

// Adiciona listeners para atualizar progresso
window.addEventListener('load', () => {
  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (el.type === 'checkbox') {
        el.addEventListener('change', atualizarProgresso);
      } else {
        el.addEventListener('input', atualizarProgresso);
      }
    }
  });
});
// =====================================================================

// =================== AVATAR AUTOMÁTICO COM INICIAIS ===================
function gerarAvatar(nome) {
  if (!nome) return '';
  const partes = nome.trim().split(' ');
  let iniciais = partes[0][0];
  if (partes.length > 1) iniciais += partes[partes.length - 1][0];
  return iniciais.toUpperCase();
}

function gerarCorAvatar(nome) {
  if (!nome) return 'from-purple-600 to-blue-600';
  const cores = [
    'from-red-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-emerald-500',
    'from-purple-500 to-violet-500',
    'from-yellow-500 to-orange-500',
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-teal-500 to-green-500'
  ];
  const index = nome.charCodeAt(0) % cores.length;
  return cores[index];
}

document.getElementById('nome')?.addEventListener('input', function() {
  const avatar = document.getElementById('avatar-preview');
  const iniciais = gerarAvatar(this.value);
  const cor = gerarCorAvatar(this.value);
  
  if (avatar) {
    avatar.textContent = iniciais;
    avatar.className = `w-20 h-20 rounded-full bg-gradient-to-br ${cor} flex items-center justify-center text-white text-3xl font-bold shadow-lg select-none transition-all duration-300`;
  }
});
// =====================================================================

// =================== FEEDBACK VISUAL NOS CAMPOS ===================
function setInputStatus(input, ok) {
  input.classList.toggle('border-green-500', ok);
  input.classList.toggle('border-red-500', !ok);
  input.classList.toggle('focus:ring-green-500', ok);
  input.classList.toggle('focus:ring-red-500', !ok);
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  setInputStatus(field, false);
  
  // Remove erro anterior se existir
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) existingError.remove();
  
  // Adiciona nova mensagem de erro
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error text-red-500 text-xs mt-1';
  errorDiv.textContent = message;
  errorDiv.setAttribute('aria-live', 'polite');
  field.parentNode.appendChild(errorDiv);
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  
  setInputStatus(field, true);
  
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) existingError.remove();
}
// =====================================================================

// Calcula idade a partir da data de nascimento
document.getElementById('dataNascimento')?.addEventListener('change', function () {
  const hoje = new Date();
  const nascimento = new Date(this.value);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();

  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  const idadeField = document.getElementById('idade');
  if (idadeField) {
    idadeField.value = idade >= 0 ? idade : '';
    
    // Validação de idade
    if (idade < 18) {
      showFieldError('dataNascimento', 'Você deve ter pelo menos 18 anos para se cadastrar.');
    } else {
      clearFieldError('dataNascimento');
    }
  }
  
  atualizarProgresso();
});

// =================== MÁSCARAS E VALIDAÇÕES ===================
// Máscara telefone
function formatarTelefone(value) {
  value = value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
  if (value.length <= 10) {
    value = value.replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  } else {
    value = value.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
  }
  if (value.endsWith('-')) {
    value = value.slice(0, -1);
  }
  return value;
}

window.addEventListener('load', function () {
  const telInput = document.getElementById('telefone');
  if (telInput) {
    telInput.addEventListener('input', function () {
      this.value = formatarTelefone(this.value);
      
      // Validação básica de telefone
      const cleanPhone = this.value.replace(/\D/g, '');
      if (cleanPhone.length >= 10 && cleanPhone.length <= 11) {
        clearFieldError('telefone');
      } else if (cleanPhone.length > 0) {
        showFieldError('telefone', 'Telefone deve ter 10 ou 11 dígitos.');
      }
    });
  }
});

// Máscara CPF
function formatarCPF(value) {
  value = value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return value;
}

document.getElementById('cpf')?.addEventListener('input', function () {
  this.value = formatarCPF(this.value);
  
  // Validação em tempo real
  const cpfLimpo = this.value.replace(/\D/g, '');
  if (cpfLimpo.length === 11) {
    if (validarCPF(this.value)) {
      clearFieldError('cpf');
    } else {
      showFieldError('cpf', 'CPF inválido.');
    }
  } else if (cpfLimpo.length > 0) {
    clearFieldError('cpf');
  }
});

// Máscara CNPJ
function formatarCNPJ(value) {
  value = value.replace(/\D/g, '');
  if (value.length > 14) value = value.slice(0, 14);
  value = value.replace(/^(\d{2})(\d)/, '$1.$2');
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
  value = value.replace(/(\d{4})(\d)/, '$1-$2');
  return value;
}

document.getElementById('cnpj')?.addEventListener('input', function () {
  this.value = formatarCNPJ(this.value);
  
  // Validação em tempo real
  const cnpjLimpo = this.value.replace(/\D/g, '');
  if (cnpjLimpo.length === 14) {
    if (validarCNPJ(this.value)) {
      clearFieldError('cnpj');
    } else {
      showFieldError('cnpj', 'CNPJ inválido.');
    }
  } else if (cnpjLimpo.length > 0) {
    clearFieldError('cnpj');
  }
});

// ===== Validação real de CPF e CNPJ =====
function validarCPF(cpf) {
  cpf = (cpf || '').replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i), 10) * (10 - i);
  let dv1 = (soma * 10) % 11;
  if (dv1 === 10) dv1 = 0;
  if (dv1 !== parseInt(cpf.charAt(9), 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i), 10) * (11 - i);
  let dv2 = (soma * 10) % 11;
  if (dv2 === 10) dv2 = 0;
  return dv2 === parseInt(cpf.charAt(10), 10);
}

function validarCNPJ(cnpj) {
  cnpj = (cnpj || '').replace(/\D/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calcDV = (base) => {
    const numeros = base.replace(/\D/g, '');
    const pesos = [];
    let peso = numeros.length === 12 ? 5 : 6;
    for (let i = 0; i < numeros.length; i++) {
      pesos.push(peso);
      peso--;
      if (peso < 2) peso = 9;
    }
    let soma = 0;
    for (let i = 0; i < numeros.length; i++) {
      soma += parseInt(numeros.charAt(i), 10) * pesos[i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const dv1 = calcDV(cnpj.substring(0, 12));
  if (dv1 !== parseInt(cnpj.charAt(12), 10)) return false;

  const dv2 = calcDV(cnpj.substring(0, 13));
  return dv2 === parseInt(cnpj.charAt(13), 10);
}

// Validação de e-mail
document.getElementById('email')?.addEventListener('blur', function() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (this.value && !emailRegex.test(this.value)) {
    showFieldError('email', 'E-mail inválido.');
  } else if (this.value) {
    clearFieldError('email');
  }
});

// =================== AUTOCOMPLETE DE ESTADOS ===================
const estados = [
  "Acre", "Alagoas", "Amapá", "Amazonas", "Bahia", "Ceará",
  "Distrito Federal", "Espírito Santo", "Goiás", "Maranhão",
  "Mato Grosso", "Mato Grosso do Sul", "Minas Gerais", "Pará",
  "Paraíba", "Paraná", "Pernambuco", "Piauí", "Rio de Janeiro",
  "Rio Grande do Norte", "Rio Grande do Sul", "Rondônia",
  "Roraima", "Santa Catarina", "São Paulo", "Sergipe", "Tocantins"
];

window.addEventListener('load', () => {
  const inputEstado = document.getElementById('estado');
  const suggestionsBox = document.getElementById('estado-suggestions');

  if (inputEstado && suggestionsBox) {
    inputEstado.addEventListener('input', function () {
      const query = this.value.toLowerCase();
      suggestionsBox.innerHTML = '';

      if (query.length >= 2) {
        const matches = estados.filter(estado => estado.toLowerCase().includes(query));

        if (matches.length > 0) {
          matches.forEach(estado => {
            const div = document.createElement('div');
            div.textContent = estado;
            div.classList.add('p-2', 'hover:bg-gray-200', 'cursor-pointer', 'border-b', 'border-gray-100');
            div.addEventListener('click', () => {
              inputEstado.value = estado;
              suggestionsBox.innerHTML = '';
              suggestionsBox.classList.add('hidden');
              clearFieldError('estado');
              atualizarProgresso();
            });
            suggestionsBox.appendChild(div);
          });
          suggestionsBox.classList.remove('hidden');
        } else {
          suggestionsBox.classList.add('hidden');
        }
      } else {
        suggestionsBox.classList.add('hidden');
      }
    });

    // Valida se o estado é válido
    inputEstado.addEventListener('blur', function() {
      if (this.value && !estados.includes(this.value)) {
        showFieldError('estado', 'Selecione um estado válido da lista.');
      } else if (this.value) {
        clearFieldError('estado');
      }
    });

    // Fecha as sugestões se clicar fora
    document.addEventListener('click', (e) => {
      if (e.target !== inputEstado) {
        suggestionsBox.classList.add('hidden');
      }
    });
  }
});

// =================== FORÇA DA SENHA VISUAL ===================
const senhaInput = document.getElementById("senha");
if (senhaInput) {
  const requisitos = {
    maiuscula: document.getElementById("req-maiuscula"),
    minuscula: document.getElementById("req-minuscula"),
    numero: document.getElementById("req-numero"),
    tamanho: document.getElementById("req-tamanho"),
    simbolo: document.getElementById("req-simbolo")
  };

  function updateReq(el, ok, label) {
    if (!el) return;
    const icon = ok ? "✅" : "❌";
    el.innerHTML = `<span class="w-4 h-4 mr-2 ${ok ? 'text-green-500' : 'text-red-500'}">${icon}</span>${label}`;
    el.classList.toggle("text-green-500", ok);
    el.classList.toggle("text-red-500", !ok);
  }

  senhaInput.addEventListener("input", () => {
    const senha = senhaInput.value;
    let score = 0;
    
    const hasMaiuscula = /[A-Z]/.test(senha);
    const hasMinuscula = /[a-z]/.test(senha);
    const hasNumero = /\d/.test(senha);
    const hasTamanho = senha.length >= 8;
    const hasSimbolo = /[!@#$%^&*]/.test(senha);

    if (hasMaiuscula) score++;
    if (hasMinuscula) score++;
    if (hasNumero) score++;
    if (hasTamanho) score++;
    if (hasSimbolo) score++;

    // Atualiza requisitos visuais
    updateReq(requisitos.maiuscula, hasMaiuscula, "Letra maiúscula");
    updateReq(requisitos.minuscula, hasMinuscula, "Letra minúscula");
    updateReq(requisitos.numero, hasNumero, "Número");
    updateReq(requisitos.tamanho, hasTamanho, "Mínimo de 8 caracteres");
    updateReq(requisitos.simbolo, hasSimbolo, "Pelo menos 1 símbolo (!@#$%^&*)");

    // Atualiza barra de força
    const bar = document.getElementById('password-strength-bar');
    const text = document.getElementById('password-strength-text');
    
    if (bar && text) {
      let cor = 'bg-red-500';
      let label = 'Muito Fraca';
      
      if (score >= 5) { cor = 'bg-green-500'; label = 'Muito Forte'; }
      else if (score >= 4) { cor = 'bg-green-400'; label = 'Forte'; }
      else if (score >= 3) { cor = 'bg-yellow-500'; label = 'Média'; }
      else if (score >= 2) { cor = 'bg-orange-500'; label = 'Fraca'; }
      
      bar.style.width = (score * 20) + '%';
      bar.className = `h-2 rounded transition-all duration-300 ${cor}`;
      text.textContent = label;
      text.className = `text-xs mt-1 font-medium ${cor.replace('bg-', 'text-')}`;
    }

    // Feedback no campo
    if (senha.length > 0) {
      if (score >= 4) {
        clearFieldError('senha');
      } else if (score < 3) {
        setInputStatus(senhaInput, false);
      }
    }
  });
}

// =================== MOSTRAR/OCULTAR SENHA ===================
document.addEventListener('DOMContentLoaded', function () {
  const senhaEl = document.getElementById('senha');
  const confirmarEl = document.getElementById('confirmarSenha');

  const toggleSenhaBtn = document.getElementById('toggle-senha');
  const iconEye = document.getElementById('icon-eye');
  const iconEyeOff = document.getElementById('icon-eye-off');

  const toggleConfirmarBtn = document.getElementById('toggle-confirmar');
  const iconEye2 = document.getElementById('icon-eye-2');
  const iconEyeOff2 = document.getElementById('icon-eye-off-2');

  if (toggleSenhaBtn && senhaEl) {
    toggleSenhaBtn.addEventListener('click', () => {
      const hidden = senhaEl.type === 'password';
      senhaEl.type = hidden ? 'text' : 'password';
      toggleSenhaBtn.setAttribute('aria-label', hidden ? 'Ocultar senha' : 'Mostrar senha');
      if (iconEye && iconEyeOff) {
        iconEye.classList.toggle('hidden', !hidden);
        iconEyeOff.classList.toggle('hidden', hidden);
      }
    });
  }

  if (toggleConfirmarBtn && confirmarEl) {
    toggleConfirmarBtn.addEventListener('click', () => {
      const hidden = confirmarEl.type === 'password';
      confirmarEl.type = hidden ? 'text' : 'password';
      toggleConfirmarBtn.setAttribute('aria-label', hidden ? 'Ocultar senha' : 'Mostrar senha');
      if (iconEye2 && iconEyeOff2) {
        iconEye2.classList.toggle('hidden', !hidden);
        iconEyeOff2.classList.toggle('hidden', hidden);
      }
    });
  }

  // Validação da confirmação da senha em tempo real
  const erroSenhaEl = document.getElementById('confirmar-senha-erro');

  function validarConfirmacaoSenha() {
    if (!senhaEl || !confirmarEl) return;

    const senhaVal = senhaEl.value;
    const confirmarVal = confirmarEl.value;

    // Só mostra o erro se o campo de confirmação tiver algo digitado
    if (confirmarVal && senhaVal !== confirmarVal) {
      if (erroSenhaEl) {
        erroSenhaEl.textContent = 'As senhas não coincidem.';
        erroSenhaEl.classList.remove('hidden');
      }
      setInputStatus(confirmarEl, false);
    } else {
      if (erroSenhaEl) {
        erroSenhaEl.textContent = '';
        erroSenhaEl.classList.add('hidden');
      }
      if (confirmarVal) {
        setInputStatus(confirmarEl, true);
      }
    }
  }

  // Adiciona os listeners nos dois campos de senha
  if (senhaEl && confirmarEl) {
    senhaEl.addEventListener('input', validarConfirmacaoSenha);
    confirmarEl.addEventListener('input', validarConfirmacaoSenha);
  }
});

// =================== CONFETE DE SUCESSO ===================
function createConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';
  
  const confettiPieces = [];
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
  
  // Criar peças de confete
  for (let i = 0; i < 100; i++) {
    confettiPieces.push({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    confettiPieces.forEach((piece, index) => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.rotation += piece.rotationSpeed;
      piece.vy += 0.1; // gravidade
      
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation * Math.PI / 180);
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size/2, -piece.size/2, piece.size, piece.size);
      ctx.restore();
      
      // Remove peças que saíram da tela
      if (piece.y > canvas.height + 10) {
        confettiPieces.splice(index, 1);
      }
    });
    
    if (confettiPieces.length > 0) {
      requestAnimationFrame(animate);
    } else {
      canvas.style.display = 'none';
    }
  }
  
  animate();
}

// =================== VALIDAÇÕES E ENVIO DO FORMULÁRIO ===================
document.getElementById("accountForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  // Validação final para garantir que as senhas são iguais antes de enviar
  const senha = document.getElementById('senha').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;
  if (senha !== confirmarSenha) {
    showFieldError('confirmarSenha', 'As senhas não coincidem.');
    document.getElementById('confirmarSenha').focus();
    return;
  }

  if (!document.getElementById("termos").checked) {
    alert("Você deve aceitar os Termos de Uso e a Política de Privacidade para continuar.");
    document.getElementById("termos").focus();
    return;
  }

  const idade = parseInt(document.getElementById("idade").value, 10);
  if (isNaN(idade) || idade < 18) {
    showFieldError('dataNascimento', 'Você deve ter pelo menos 18 anos para se cadastrar.');
    document.getElementById("dataNascimento").focus();
    return;
  }

  // Valida CPF e CNPJ antes de prosseguir
  const cpfVal = document.getElementById("cpf").value;
  const cnpjVal = document.getElementById("cnpj").value;

  if (!validarCPF(cpfVal)) {
    showFieldError('cpf', 'CPF inválido. Verifique e tente novamente.');
    document.getElementById("cpf").focus();
    return;
  }

  if (!validarCNPJ(cnpjVal)) {
    showFieldError('cnpj', 'CNPJ inválido. Verifique e tente novamente.');
    document.getElementById("cnpj").focus();
    return;
  }

  // Validação de estado
  const estadoVal = document.getElementById("estado").value;
  if (!estados.includes(estadoVal)) {
    showFieldError('estado', 'Selecione um estado válido.');
    document.getElementById("estado").focus();
    return;
  }

  // Mostra loading no botão
  const btnSubmit = document.getElementById('btn-submit');
  const btnText = document.getElementById('btn-submit-text');
  const btnLoading = document.getElementById('btn-loading');
  
  if (btnSubmit && btnText && btnLoading) {
    btnSubmit.disabled = true;
    btnText.textContent = 'Criando conta...';
    btnLoading.classList.remove('hidden');
  }

  const formData = {
    nome: document.getElementById("nome").value.trim(),
    email: document.getElementById("email").value.trim(),
    telefone: document.getElementById("telefone").value.trim(),
    cpf: cpfVal.trim(),
    idade: idade,
    empresa: document.getElementById("empresa").value.trim(),
    cnpj: cnpjVal.trim(),
    estado: estadoVal.trim(),
    dataNascimento: document.getElementById("dataNascimento").value.trim()
  };

  try {
    // 1) Cria o usuário no Auth
    const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
      email: formData.email,
      password: senha.trim(),
      options: {
        data: { nome: formData.nome }
      }
    });

    // Tratamento de e-mail já cadastrado
    if (signUpError) {
      if (signUpError.message && signUpError.message.includes("User already registered")) {
        showEmailExistsModal();
      } else {
        alert('Erro ao criar conta: ' + signUpError.message);
      }
      return;
    }

    // 2) Pega o user.id para relacionar no seu perfil
    const userId = signUpData.user?.id;

    // 3) Insere na tabela usuarios
    const { error: insertError } = await supabaseClient
      .from('usuarios')
      .insert([{ ...formData, auth_user_id: userId }]);

    if (insertError) {
      alert('Erro ao salvar perfil: ' + insertError.message);
      return;
    }
    
    // Dispara confete de sucesso
    createConfetti();
    
    // Abre modal de verificação
    openVerifyModal(formData.email);
    try {
      await sendEmailOtp(formData.email);
      startResendTimer();
    } catch (err) {
      console.error('Erro ao enviar OTP inicial:', err);
      showVerifyError('Não foi possível enviar o código de verificação. Tente reenviar.');
    }

  } catch (error) {
    console.error('Erro geral:', error);
    alert('Erro inesperado. Tente novamente.');
  } finally {
    // Restaura o botão
    if (btnSubmit && btnText && btnLoading) {
      btnSubmit.disabled = false;
      btnText.textContent = 'Criar Minha Conta';
      btnLoading.classList.add('hidden');
    }
  }
});

// =================== MODAL DE VERIFICAÇÃO E OTP ===================
let lastSignupEmail = null;
let resendCooldown = 30; // segundos entre reenvios
let resendInterval = null;

function openVerifyModal(email) {
  lastSignupEmail = email;
  const emailSpan = document.getElementById('verify-email');
  const codeInput = document.getElementById('verify-code');
  const modal = document.getElementById('verify-modal');
  
  if (emailSpan) emailSpan.textContent = email;
  if (codeInput) codeInput.value = '';
  hideVerifyMessages();
  
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    // Foca no campo de código para acessibilidade
    setTimeout(() => codeInput?.focus(), 100);
  }
}

function closeVerifyModal() {
  const modal = document.getElementById('verify-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  stopResendTimer();
  
  // Opcional: resetar o formulário e redirecionar após fechar
  const form = document.getElementById("accountForm");
  if (form) form.reset();
  
  const idadeField = document.getElementById("idade");
  if (idadeField) idadeField.value = '';
  
  // Limpa avatar
  const avatar = document.getElementById('avatar-preview');
  if (avatar) {
    avatar.textContent = '';
    avatar.className = 'w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg select-none';
  }
  
  // Reseta progresso
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) progressBar.style.width = '0%';
}

function showVerifyError(msg) {
  const el = document.getElementById('verify-error');
  if (el) {
    el.textContent = msg || 'Ocorreu um erro. Tente novamente.';
    el.classList.remove('hidden');
  }
}

function showVerifySuccess(msg) {
  const el = document.getElementById('verify-success');
  if (el) {
    el.textContent = msg || 'Verificado com sucesso!';
    el.classList.remove('hidden');
  }
}

function hideVerifyMessages() {
  const errorEl = document.getElementById('verify-error');
  const successEl = document.getElementById('verify-success');
  if (errorEl) errorEl.classList.add('hidden');
  if (successEl) successEl.classList.add('hidden');
}

async function sendEmailOtp(email) {
  // Envia um OTP por e-mail (requer Email OTP habilitado no Supabase)
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false, // Não cria um novo usuário, apenas envia o código
    }
  });
  if (error) throw error;
}

async function verifyEmailOtp(email, code) {
  // type: 'email' para validar OTP de e-mail
  const { data, error } = await supabaseClient.auth.verifyOtp({
    email,
    token: code,
    type: 'email'
  });
  if (error) throw error;
  return data;
}

// Timer de reenvio
function startResendTimer() {
  const btn = document.getElementById('verify-resend');
  const timer = document.getElementById('resend-timer');
  let remaining = resendCooldown;

  if (btn) btn.disabled = true;
  if (timer) timer.textContent = `Reenviar em ${remaining}s`;

  resendInterval = setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      stopResendTimer();
      if (btn) btn.disabled = false;
      if (timer) timer.textContent = '';
    } else {
      if (timer) timer.textContent = `Reenviar em ${remaining}s`;
    }
  }, 1000);
}

function stopResendTimer() {
  if (resendInterval) {
    clearInterval(resendInterval);
    resendInterval = null;
  }
  const btn = document.getElementById('verify-resend');
  if (btn) btn.disabled = false;
  
  const timer = document.getElementById('resend-timer');
  if (timer) timer.textContent = '';
}

// Eventos do modal
document.getElementById('verify-close')?.addEventListener('click', closeVerifyModal);

document.getElementById('verify-submit')?.addEventListener('click', async () => {
  hideVerifyMessages();
  const codeInput = document.getElementById('verify-code');
  const code = (codeInput?.value || '').trim();
  
  if (code.length !== 6) {
    showVerifyError('Informe o código de 6 dígitos.');
    codeInput?.focus();
    return;
  }
  
  const btn = document.getElementById('verify-submit');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Verificando...';
  }
  
  try {
    await verifyEmailOtp(lastSignupEmail, code);
    showVerifySuccess('E-mail verificado com sucesso! Redirecionando...');
    
    // Dispara mais confete
    setTimeout(createConfetti, 500);
    
    // Fecha o modal e redireciona após 3 segundos
    setTimeout(() => {
      closeVerifyModal();
      window.location.href = 'login.html';
    }, 3000);
    
  } catch (err) {
    showVerifyError('Código inválido ou expirado. Tente novamente.');
    console.error('verifyOtp error:', err);
    codeInput?.focus();
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Verificar';
    }
  }
});

document.getElementById('verify-resend')?.addEventListener('click', async () => {
  hideVerifyMessages();
  const btn = document.getElementById('verify-resend');
  
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Enviando...';
  }
  
  try {
    await sendEmailOtp(lastSignupEmail);
    showVerifySuccess('Código reenviado. Verifique seu e-mail.');
    startResendTimer();
  } catch (err) {
    showVerifyError('Não foi possível reenviar o código. Tente novamente mais tarde.');
    console.error('sendEmailOtp error:', err);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Reenviar código';
    }
  }
});

// =================== ACESSIBILIDADE E MELHORIAS FINAIS ===================
// Permite usar Enter para verificar o código
document.getElementById('verify-code')?.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    document.getElementById('verify-submit')?.click();
  }
});

// Formata automaticamente o código (apenas números)
document.getElementById('verify-code')?.addEventListener('input', function() {
  this.value = this.value.replace(/\D/g, '').slice(0, 6);
});

// Fecha modal com ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const verifyModal = document.getElementById('verify-modal');
    const emailModal = document.getElementById('email-exists-modal');
    
    if (verifyModal && !verifyModal.classList.contains('hidden')) {
      closeVerifyModal();
    }
    if (emailModal && !emailModal.classList.contains('hidden')) {
      closeEmailExistsModal();
    }
  }
});

// Inicialização final
window.addEventListener('load', () => {
  console.log('Formulário de cadastro carregado com todas as funcionalidades!');
  
  // Foca no primeiro campo
  const nomeField = document.getElementById('nome');
  if (nomeField) nomeField.focus();
  
  // Inicializa progresso
  atualizarProgresso();
});