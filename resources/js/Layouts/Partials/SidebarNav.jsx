import React from 'react'
import { router, usePage } from '@inertiajs/react'
import { Sidebar } from 'flowbite-react'
import { 
  HiChartPie,
  HiUser,
  HiUsers,
  HiUserGroup,
  HiUserCircle,
  HiGift,
  HiClipboardCheck, HiLogout } from 'react-icons/hi'
import Dashboard from '@/Pages/Dashboard'
import routes from './routes'
import { filterOpenMenu } from './helpers'



export function SidebarNav() {
  const {
    props: { text_footer },
  } = usePage()

  const menus = routes.filter((item) => {
    item.open = false
    if (!item.show) {
      return null
    }
    return filterOpenMenu(item)
  })

  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {menus.map((item) => (
            <div key={item.name}>
              {item.items === undefined ? (
                <Sidebar.Item
                  onClick={() => router.visit(item.route)}
                  icon={item.icon}
                  active={route().current(item.active)}
                >
                  {item.name}
                </Sidebar.Item>
              ) : (
                <Sidebar.Collapse
                  icon={item.icon}
                  label={item.name}
                  open={item.open}
                >
                  {item.items.map((item) => (
                    <Sidebar.Item
                      key={item.name}
                      onClick={() =>
                        router.visit(item.route)
                      }
                      icon={item.icon}
                      active={route().current(
                        item.active
                      )}
                    >
                      {item.name}
                    </Sidebar.Item>
                  ))}
                </Sidebar.Collapse>
              )}
            </div>
          ))}
          <Sidebar.Item
            onClick={() => router.post(route('logout'))}
            icon={HiLogout}
          >
            Logout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <p className="text-sm font-light text-gray-900 dark:text-gray-100 text-center bottom-4 left-4 pt-10">
          {text_footer}
          {/* &copy; {new Date().getFullYear()} */}
        </p>
      </Sidebar.Items>
    </Sidebar>
  );
}
