import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// YAHAN HAIN TERE ASLI PROJECT KE LINKS
const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Events', href: '/events' },
  { name: 'Jobs', href: '/jobs' },
  { name: 'Meeting', href: '/meeting' },
  { name: 'Search Alumni', href: '/search-people' },
  { name: 'Send Mail', href: '/send-mail' },
  { name: 'News & Notices', href: '/newsletter' },
  { name: 'Feedback', href: '/feedback' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function Navbar() {
  const location = useLocation(); // Current page pata karne ke liye
  const navigate = useNavigate();

  const handleLogout = () => {
    // Yahan apni logout logic daal dena (jaise localStorage clear karna)
    localStorage.clear(); 
    navigate('/login');
  };

  return (
    <Disclosure as="nav" className="bg-gray-900 sticky top-0 z-50 shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              {/* Logo & Desktop Links */}
              <div className="flex flex-1 items-center justify-center lg:items-stretch lg:justify-start">
                
                {/* Logo Section */}
                <div className="flex flex-shrink-0 items-center mr-4">
                  <span className="text-white font-bold text-xl tracking-wider">🎓 AlumniConnect</span>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:ml-6 lg:block">
                  <div className="flex space-x-2">
                    {navigation.map((item) => {
                      // Logic check if this route is currently active
                      const isCurrent = location.pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            isCurrent
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                            'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200'
                          )}
                          aria-current={isCurrent ? 'page' : undefined}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Side - Logout Button */}
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  onClick={handleLogout}
                  className="relative flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition"
                >
                  <span className="hidden sm:inline">Logout</span>
                  <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

            </div>
          </div>

          {/* Mobile Menu Panel */}
          <Disclosure.Panel className="lg:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 bg-gray-900 border-t border-gray-800">
              {navigation.map((item) => {
                const isCurrent = location.pathname === item.href;
                return (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={classNames(
                      isCurrent
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={isCurrent ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                );
              })}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar;