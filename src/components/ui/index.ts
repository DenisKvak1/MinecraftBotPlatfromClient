import { DefineComponent } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {Label} from "@/components/ui/label";

const components:DefineComponent[] = [
   Button as any, Input,
    Label
]
export default components