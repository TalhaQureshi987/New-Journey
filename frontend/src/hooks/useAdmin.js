import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useAdminActions = () => {
  const queryClient = useQueryClient();

  const updateUserStatus = useMutation(
    async ({ userId, status }) => {
      const response = await axios.patch(`/api/v1/admin/users/${userId}/status`, 
        { status },
        { withCredentials: true }
      );
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['admin-users']);
        toast.success('User status updated successfully');
      },
      onError: (error) => {
        console.error('Error updating user status:', error);
        toast.error('Failed to update user status');
      }
    }
  );

  return {
    updateUserStatus
  };
};