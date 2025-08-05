// --- Element Selectors ---
const screens = {
    splash: document.getElementById('splash-screen'),
    onboarding: document.getElementById('onboarding-screen'),
    dashboard: document.getElementById('dashboard-screen'),
    profile: document.getElementById('profile-modal'),
    newService: document.getElementById('new-service-screen'),
    serviceDetail: document.getElementById('service-detail-screen'),
};

const authForm = {
    displayNameField: document.getElementById('displayName-field'),
    submitBtn: document.getElementById('auth-submit-btn'),
    loginToggle: document.getElementById('toggle-login'),
    signupToggle: document.getElementById('toggle-signup'),
};

const profileElements = {
    button: document.getElementById('profile-button'),
    modalPic: document.getElementById('modal-profile-pic'),
    modalName: document.getElementById('modal-display-name'),
    modalEmail: document.getElementById('modal-email'),
};

const dashboardElements = {
    headerText: document.getElementById('dashboard-header-text'),
    serviceList: document.getElementById('service-list'),
};

const newServiceElements = {
    choiceStep: document.getElementById('service-choice-step'),
    uploadStep: document.getElementById('upload-step'),
    uploadForm: document.getElementById('upload-form'),
    fileInput: document.getElementById('file-upload'),
    deployBtn: document.getElementById('deploy-btn'),
    validationMsg: document.getElementById('validation-msg'),
};

const detailElements = {
    siteName: document.getElementById('detail-site-name'),
    siteUrl: document.getElementById('detail-site-url'),
    fileList: document.getElementById('detail-file-list'),
};

// --- UI Functions ---

export const showScreen = (screenName) => {
    Object.values(screens).forEach(screen => screen && screen.classList.remove('active'));
    if (screens[screenName]) screens[screenName].classList.add('active');
};

export const toggleAuthForm = (mode) => {
    if (mode === 'signup') {
        authForm.loginToggle.classList.remove('active');
        authForm.signupToggle.classList.add('active');
        authForm.displayNameField.classList.add('visible');
        authForm.submitBtn.textContent = 'Sign Up';
    } else { // 'login'
        authForm.signupToggle.classList.remove('active');
        authForm.loginToggle.classList.add('active');
        authForm.displayNameField.classList.remove('visible');
        authForm.submitBtn.textContent = 'Login';
    }
};

export const updateProfile = (user) => {
    if (!user) return;
    const picUrl = user.profilePicture ? user.profilePicture : `https://placehold.co/120x120/0a1929/00ffff?text=${user.displayName.charAt(0)}`;
    profileElements.button.style.backgroundImage = `url(${picUrl})`;
    profileElements.modalPic.style.backgroundImage = `url(${picUrl})`;
    profileElements.modalName.textContent = user.displayName;
    profileElements.modalEmail.textContent = user.email;
};

export const renderDashboard = (sites, user, onSiteClick) => {
    dashboardElements.headerText.textContent = `Welcome, ${user.displayName}`;
    const serviceList = dashboardElements.serviceList;
    serviceList.innerHTML = '';
    if (sites.length === 0) {
        serviceList.innerHTML = '<p>You have no sites deployed. Click "+ New Site" to begin.</p>';
        return;
    }
    sites.forEach(siteName => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<h4>${siteName}</h4><p>Static Site</p>`;
        card.onclick = () => onSiteClick(siteName);
        serviceList.appendChild(card);
    });
};

export const renderServiceDetails = (data) => {
    detailElements.siteName.textContent = data.siteName;
    detailElements.siteUrl.textContent = window.location.origin + data.url;
    detailElements.siteUrl.href = data.url;

    const fileList = detailElements.fileList;
    fileList.innerHTML = '';
    if (data.files && data.files.length > 0) {
        data.files.forEach(file => {
            const fileEl = document.createElement('div');
            fileEl.className = 'file-list-item';
            fileEl.innerHTML = `<label>${file}</label>`;
            fileList.appendChild(fileEl);
        });
    } else {
        fileList.innerHTML = '<p>No files found for this site.</p>';
    }
};

export const updateValidationMessage = (message, isValid) => {
    newServiceElements.validationMsg.textContent = message;
    newServiceElements.validationMsg.className = 'validation-msg'; // Reset
    if (isValid === true) newServiceElements.validationMsg.classList.add('valid');
    if (isValid === false) newServiceElements.validationMsg.classList.add('invalid');
};

export const resetNewServiceForm = () => {
    newServiceElements.choiceStep.style.display = 'block';
    newServiceElements.uploadStep.style.display = 'none';
    newServiceElements.uploadForm.reset();
    newServiceElements.deployBtn.disabled = true;
    updateValidationMessage('Awaiting files...');
};

export const setButtonState = (button, text, disabled) => {
    button.textContent = text;
    button.disabled = disabled;
};
