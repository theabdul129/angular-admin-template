import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { IconsMockApi } from 'app/mock-api/ui/icons/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { ChatMockApi } from './apps/chat/api';

export const mockApiServices = [
    AuthMockApi,
    IconsMockApi,
    NavigationMockApi,
    ChatMockApi
];
