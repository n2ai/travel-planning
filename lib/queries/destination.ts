import {createClient} from '@/lib/supabase/server';
import type { Destination } from '@/lib/type';

export async function getAllDestinations():Promise<Destination[]> {
    const supabase = await createClient();

    const {data, error} = await supabase.from('destinations').select('*').order('created_at', {ascending: false});

    if(error) {
        throw new Error(error.message);
    }

    return data as Destination[];
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
    const supabase = await createClient();

    const {data, error} = await supabase.from('destinations').select('*').eq('slug', slug).single();

    if (error) {
        if (error.code === 'PGRST116') return null;   // không tìm thấy → 404 hợp lệ
        throw new Error(error.message);               // lỗi hệ thống → nổ to lên
    }
    return data as Destination;

}