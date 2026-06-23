import { useEffect, useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';

export function AdminLoginModal() {
  const [showModal, setShowModal] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAdminStore((state) => state.login);

  // Listen for Ctrl+Shift+A to open login modal
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setShowModal(true);
        setError('');
      }
      // Esc to close
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showModal]);

  const handleLogin = () => {
    // Hardcoded credentials: Admin / Mobile@123
    if (adminId === 'Admin' && password === 'Mobile@123') {
      const sessionToken = `token_${Date.now()}_${Math.random()}`;
      login(adminId, sessionToken);
      setShowModal(false);
      setAdminId('');
      setPassword('');
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-8 w-96 shadow-2xl">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Admin Panel</h2>
            <p className="text-sm text-muted-foreground mt-1">Enter credentials to continue</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Admin ID
              </label>
              <input
                type="text"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter admin ID"
                className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Enter password"
                className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleLogin}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Login
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Keyboard shortcut: Ctrl+Shift+A
          </p>
        </div>
      </div>
    </div>
  );
}
