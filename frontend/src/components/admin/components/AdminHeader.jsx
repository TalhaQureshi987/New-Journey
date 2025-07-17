import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../ui/input';

const AdminHeader = ({ title, subtitle, actions, searchQuery, onSearchChange }) => {
  return (
    <div className="bg-white border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader; 