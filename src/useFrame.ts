import { useContext } from 'react';
import { FrameContext } from './FrameContext';

export const useFrame = () => useContext(FrameContext);
