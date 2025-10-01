import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Package, Users, ShoppingCart, DollarSign, BarChart3, Settings, Brain, User, LogOut, Eye, CreditCard as Edit, Lock, ChevronDown, CreditCard, Crown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStripe } from '../hooks/useStripe';

interface LayoutProps {
  children: React.ReactNode;
}


const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'products', label: 'Produtos', icon: Package },
  { id: 'customers', label: 'Clientes', icon: Users },
  { id: 'sales', label: 'Vendas', icon: ShoppingCart },
  { id: 'finance', label: 'Financeiro', icon: DollarSign },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  { id: 'ai-insights', label: 'IA Insights', icon: Brain },
  { id: 'pricing', label: 'Planos', icon: CreditCard },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { getCurrentPlan, isSubscriptionActive } = useStripe();
  const location = useLocation();
  const navigate = useNavigate();

  const profileRef = useRef<HTMLDivElement>(null);


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    signOut();
  };

  const handleViewProfile = () => {
    navigate('/settings');
    setProfileOpen(false);
  };

  const handleEditProfile = () => {
    navigate('/settings');
    setProfileOpen(false);
  };

  const userAvatar = user?.user_metadata?.avatar_url;
  const userName = user?.user_metadata?.full_name || 'Usuário';
  const userEmail = user?.email || 'usuario@email.com';

  // Get current page from URL
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'dashboard';
    return path.substring(1);
  };

  const currentPage = getCurrentPage();

  const mainNavigationItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'sales', label: 'Vendas', icon: ShoppingCart },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'reports', label: 'Mais', icon: BarChart3 }
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 sm:w-80 md:w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 mt-2 sm:mt-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">ERP Smart</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 touch-target"
              aria-label="Fechar menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1.5 sm:space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(`/${item.id === 'dashboard' ? 'dashboard' : item.id}`);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-3 sm:px-4 py-3 sm:py-3 rounded-lg text-left transition-all duration-200 touch-target
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 sm:w-5 sm:h-5 mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  <span className="font-medium text-base sm:text-base">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            {/* Current Plan Display */}
            <div className={`mb-4 p-3 rounded-lg ${
              isSubscriptionActive() 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-amber-50 border border-amber-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs font-medium uppercase tracking-wide mb-1 ${
                    isSubscriptionActive() ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {isSubscriptionActive() ? 'Plano Ativo' : 'Plano Gratuito'}
                  </p>
                  <p className={`text-sm font-semibold ${
                    isSubscriptionActive() ? 'text-green-900' : 'text-amber-900'
                  }`}>
                    {getCurrentPlan()}
                  </p>
                </div>
                {!isSubscriptionActive() && (
                  <Crown className="w-5 h-5 text-amber-600" />
                )}
              </div>
              {!isSubscriptionActive() && (
                <button
                  onClick={() => navigate('/pricing')}
                  className="w-full mt-2 px-3 py-1 bg-amber-600 text-white text-xs font-medium rounded hover:bg-amber-700 transition-colors"
                >
                  Assinar Agora
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 md:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 touch-target"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 capitalize truncate">
              {navigationItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                }}
                className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors touch-target"
                aria-label="Menu do perfil"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user?.user_metadata?.full_name || 'Usuário'}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  )}
                </div>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-600 transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-w-[calc(100vw-1rem)] profile-dropdown">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt={userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {userName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {userEmail}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <button
                      onClick={handleViewProfile}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-target"
                    >
                      <Eye className="w-4 h-4 mr-3 text-gray-400" />
                      Ver perfil
                    </button>
                    <button
                      onClick={handleEditProfile}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-target"
                    >
                      <Edit className="w-4 h-4 mr-3 text-gray-400" />
                      Editar perfil
                    </button>
                    <button
                      onClick={handleEditProfile}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-target"
                    >
                      <CreditCard className="w-4 h-4 mr-3 text-gray-400" />
                      Gerenciar assinatura
                    </button>
                    <button
                      onClick={handleEditProfile}
                      className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-target"
                    >
                      <Lock className="w-4 h-4 mr-3 text-gray-400" />
                      Alterar senha
                    </button>
                  </div>

                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors touch-target"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {mainNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(`/${item.id === 'dashboard' ? 'dashboard' : item.id}`);
                  setSidebarOpen(false);
                }}
                className={`
                  flex flex-col items-center justify-center min-w-[60px] py-2 px-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};