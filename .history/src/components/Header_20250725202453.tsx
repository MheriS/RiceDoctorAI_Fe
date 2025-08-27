import { useState } from 'react';
import { Menu, Moon, Sun, Settings, User } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';

interface HeaderProps {
  onMenuToggle: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export function Header({ onMenuToggle, darkMode, onDarkModeToggle }: HeaderProps) {
  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <h2>RiceDoctor AI</h2>
            <p className="text-xs text-muted-foreground">Sistem Klasifikasi Penyakit Padi</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={onDarkModeToggle}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent focus:outline-none focus:ring-0"
            >
              <Avatar className="h-10 w-10 rounded-full bg-transparent">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                  alt="User"
                  className="rounded-full"
                />
                <AvatarFallback>DR</AvatarFallback>
              </Avatar>
            </Button>

            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p>Dr. Petani</p>
                  <p className="text-xs text-muted-foreground">
                    petani@example.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Keluar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}