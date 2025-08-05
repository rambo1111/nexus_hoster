import * as api from './api.js';
import * as ui from './ui.js';

// --- Application State ---
let state = {
    currentUser: null,
    currentSite: null,
    authMode: 'login',
};

// --- Core Logic & Handlers ---

const handleAuthSuccess = (user) => {
    state.currentUser = user;
    ui.updateProfile(user);
    loadDashboard();
};

const loadDashboard = async () => {
    if (!state.currentUser) return;
    try {
        const sites = await api.getSites();
        ui.renderDashboard(sites, state.currentUser, handleViewDetails);
        ui.showScreen('dashboard');
    } catch (error) {
        handleLogout();
    }
};

const handleLogout = async () => {
    try {
        await api.logout();
    } catch (error) {
        console.error("Logout API call failed.", error);
    } finally {
        state.currentUser = null;
        state.authMode = 'login';
        ui.toggleAuthForm('login');
        ui.showScreen('onboarding');
    }
};

const checkLoginStatus = async () => {
    try {
        const user = await api.getCurrentUser();
        handleAuthSuccess(user);
    } catch (error) {
        state.currentUser = null;
        ui.showScreen('onboarding');
    }
};

const handleViewDetails = async (siteName) => {
    state.currentSite = siteName;
    try {
        const details = await api.getSiteDetails(siteName);
        ui.renderServiceDetails(details);
        ui.showScreen('serviceDetail');
    } catch (error) {
        alert('Could not load site details.');
        loadDashboard();
    }
};

// --- Event Listener Initialization ---

function initializeEventListeners() {
    // --- Onboarding ---
    document.getElementById('toggle-login').addEventListener('click', () => {
        state.authMode = 'login';
        ui.toggleAuthForm('login');
    });
    document.getElementById('toggle-signup').addEventListener('click', () => {
        state.authMode = 'signup';
        ui.toggleAuthForm('signup');
    });

    document.getElementById('auth-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        
        try {
            let user;
            if (state.authMode === 'signup') {
                const displayName = document.getElementById('auth-displayName').value;
                if (!displayName) return alert('Display name is required for signup.');
                user = await api.register(displayName, email, password);
            } else {
                user = await api.login(email, password);
            }
            e.target.reset();
            ui.toggleAuthForm('login');
            handleAuthSuccess(user);
        } catch (error) {
            alert(error.message);
        }
    });

    // --- Profile Modal ---
    document.getElementById('profile-button').addEventListener('click', () => ui.showScreen('profile'));
    document.getElementById('close-modal-btn').addEventListener('click', () => ui.showScreen('dashboard'));
    document.getElementById('sign-out-btn').addEventListener('click', handleLogout);

    const avatarInput = document.getElementById('avatar-upload-input');
    document.getElementById('upload-avatar-btn').addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('avatar', file);
        try {
            const result = await api.uploadProfilePicture(formData);
            state.currentUser.profilePicture = result.profilePicture;
            ui.updateProfile(state.currentUser);
            alert('Profile picture updated!');
        } catch (error) {
            alert(`Upload failed: ${error.message}`);
        }
    });
    
    // --- Navigation ---
    document.getElementById('new-service-btn').addEventListener('click', () => {
        ui.resetNewServiceForm();
        ui.showScreen('newService');
    });
    document.getElementById('back-to-dashboard-btn').addEventListener('click', loadDashboard);
    document.getElementById('detail-back-btn').addEventListener('click', loadDashboard);
    
    // --- New Site Flow ---
    document.getElementById('static-site-card').addEventListener('click', () => {
        document.getElementById('service-choice-step').style.display = 'none';
        document.getElementById('upload-step').style.display = 'block';
    });
    
    const fileInput = document.getElementById('file-upload');
    const deployBtn = document.getElementById('deploy-btn');
    
    fileInput.addEventListener('change', () => {
        if (!fileInput.files.length) return;
        const hasIndex = Array.from(fileInput.files).some(f => f.name === 'index.html');
        if (hasIndex) {
            ui.updateValidationMessage('Ready to deploy!', true);
            deployBtn.disabled = false;
        } else {
            ui.updateValidationMessage('Error: index.html is missing.', false);
            deployBtn.disabled = true;
        }
    });

    document.getElementById('upload-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        ui.setButtonState(deployBtn, 'Deploying...', true);
        const formData = new FormData(e.target);
        try {
            await api.uploadNewSite(formData);
            alert('Site deployed successfully!');
            loadDashboard();
        } catch (error) {
            alert(`Deployment Error: ${error.message}`);
        } finally {
            ui.setButtonState(deployBtn, 'Deploy', false);
        }
    });

    // --- Site Detail ---
    document.getElementById('delete-service-btn').addEventListener('click', async () => {
        if (!state.currentSite || !confirm(`Delete "${state.currentSite}"?`)) return;
        try {
            await api.deleteSite(state.currentSite);
            alert('Site deleted.');
            loadDashboard();
        } catch (error) {
            alert(error.message);
        }
    });
}

// --- Initial Application Load ---
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    setTimeout(() => {
        checkLoginStatus();
        document.getElementById('splash-screen').classList.add('hidden');
    }, 2000);
});
