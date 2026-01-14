import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, CreditCard, Edit, Gift, Mail, MapPin, Phone } from 'lucide-react';

import type { Customer } from '@/features/customer/domain/customer-entity';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
type Props = {
  data: Customer;
  onUpdateProfile: () => void;
};
export function CustomerInfoTab({ data, onUpdateProfile }: Props) {
  return (
    <>
      <Card className="rounded-none border-none p-4 shadow-none">
        <CardHeader className="flew-row flex items-center justify-between">
          <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-transparent"
            onClick={onUpdateProfile}
          >
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-border flex items-center gap-4 rounded-lg border p-4">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Mail className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Email</p>
              <p className="text-foreground font-medium">{data.email}</p>
            </div>
          </div>

          <div className="border-border flex items-center gap-4 rounded-lg border p-4">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Phone className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Số điện thoại</p>
              <p className="text-foreground font-medium">{data.phoneNumber || 'Chưa cập nhật'}</p>
            </div>
          </div>

          <div className="border-border flex items-center gap-4 rounded-lg border p-4">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <MapPin className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Địa chỉ</p>
              <p className="text-foreground font-medium">
                {data.address ? `${data.address.ward} - ${data.address.ward}` : 'Chưa cập nhật'}
              </p>
            </div>
          </div>

          <div className="border-border flex items-center gap-4 rounded-lg border p-4">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Calendar className="text-primary h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Ngày sinh</p>
              <p className="text-foreground font-medium">
                {data.dateOfBirth
                  ? format(data.dateOfBirth, 'dd/MM/yyyy', { locale: vi })
                  : 'Chưa cập nhật'}{' '}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-none border-none p-4 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">Tổng quan chi tiêu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
                  <CreditCard className="text-primary h-6 w-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Tổng chi tiêu</p>
                  <p className="text-foreground text-xl font-bold">
                    {data.customerInfo.stats.totalSpent}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="bg-accent flex h-12 w-12 items-center justify-center rounded-full">
                  <Gift className="text-accent-foreground h-6 w-6" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Điểm có thể đổi</p>
                  <p className="text-foreground text-xl font-bold">
                    {data.customerInfo.loyaltyPoints * 100}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
