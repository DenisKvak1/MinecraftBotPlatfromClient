import { toggle } from '@/API/types';

export function ToggleToToggleInfo(toggle: toggle){
	switch (toggle){
		case 'START': {
			return 'ON'
		}
		case 'STOP': {
			return 'OFF'
		}
	}
}