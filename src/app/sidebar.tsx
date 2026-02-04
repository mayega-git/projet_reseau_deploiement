'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import SideBarData from '@/data/SideBarData';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, LogOut, Star, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Logout from '@/components/Dialogs/LogoutDialog';
import { useState } from 'react';
import RatingModal from '@/components/Dialogs/RateApp.dialog';

export const AppSidebar = () => {
  const { role } = useAuth();
  const pathname = usePathname();
  const ColoredIcon = ({ Icon }: { Icon: React.FC }) => (
    <span style={{}}>
      <Icon />
    </span>
  );
  const [showLogout, setShowLogout] = useState(false);
  const [showRateApp, setShowRateApp] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenuButton
            className="hover:bg-transparent h-[80px] w-full"
            asChild
          >
            <a>
              <Image
                src="/logoBlack.png"
                alt="LetsGo Logo"
                width={120}
                height={80}
              />
            </a>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent className=" flex flex-col justify-between">
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="">
                {SideBarData.map((item, index) => {
                  // console.log(
                  //   'Checking:',
                  //   item.url,
                  //   'against pathname:',
                  //   pathname
                  // );
                  if (role && item.role.some((r) => role.includes(r))) {
                    return (
                      <Collapsible
                        key={index}
                        defaultOpen={false}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          {item.subnav.length > 0 ? (
                            <>
                              <CollapsibleTrigger asChild>
                                <SidebarMenuButton
                                  isActive={pathname === item.url}
                                >
                                  <ColoredIcon Icon={item.icon} />
                                  <span className="flex justify-between w-full items-center">
                                    {item.title}
                                    <ChevronDown
                                      size={20}
                                      color="hsl(var(--sidebar-foreground))"
                                    />
                                  </span>
                                </SidebarMenuButton>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <SidebarMenuSub>
                                  {item.subnav.map((subItem, subIndex) => {
                                    // Only render subnav items if role matches
                                    if (
                                      role &&
                                      subItem.role.some((r) => role.includes(r))
                                    ) {
                                      return (
                                        <SidebarMenuSubItem key={subIndex}>
                                          <SidebarMenuButton
                                            asChild
                                            isActive={pathname === subItem.url}
                                          >
                                            <a href={subItem.url}>
                                              <span>{subItem.title}</span>
                                            </a>
                                          </SidebarMenuButton>
                                        </SidebarMenuSubItem>
                                      );
                                    }
                                    return null; // Skip rendering subItem if role doesn't match
                                  })}
                                </SidebarMenuSub>
                              </CollapsibleContent>
                            </>
                          ) : (
                            <SidebarMenuButton
                              asChild
                              isActive={pathname === item.url}
                            >
                              <a href={item.url}>
                                <ColoredIcon Icon={item.icon} />
                                <span>{item.title}</span>
                              </a>
                            </SidebarMenuButton>
                          )}
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }
                  return null; // Ensures map returns nothing for invalid roles
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <hr className="bg-grey-500" />
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setShowRateApp(true)}
                    asChild
                    isActive={pathname === ''}
                  >
                    <div>
                      <ColoredIcon Icon={Star} />
                      <span>Rate this app</span>
                    </div>
                  </SidebarMenuButton>
                  {user && (
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/profile/${user.id}`}
                    >
                      <a href={`/profile/${user.id}`}>
                        <ColoredIcon Icon={User} />
                        <span>My Profile</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                  <SidebarMenuButton
                    onClick={() => setShowLogout(true)}
                    asChild
                    isActive={pathname === ''}
                  >
                    <div>
                      <ColoredIcon Icon={LogOut} />
                      <span>Logout</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      {showLogout && (
        <Logout showLogout={showLogout} setShowLogout={setShowLogout} />
      )}

      {showRateApp && (
        <RatingModal showDialog={showRateApp} setShowDialog={setShowRateApp} />
      )}
    </>
  );
};
