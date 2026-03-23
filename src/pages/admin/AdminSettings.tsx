import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    storeName: "Boutique Chic Accessory",
    whatsapp: "+15551234567",
    email: "info@boutiquechic.com",
    phone: "+1 (555) 123-4567",
    address: "123 Luxury Ave, Suite 100, New York, NY 10001",
    instagram: "https://instagram.com/boutiquechic",
    facebook: "https://facebook.com/boutiquechic",
    about: "Your destination for luxury watches, necklaces, and curated accessories.",
  });

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="font-serif">Store Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Store Name</label>
            <Input
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="bg-secondary/30 border-border"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">About</label>
            <Textarea
              value={settings.about}
              onChange={(e) => setSettings({ ...settings, about: e.target.value })}
              className="bg-secondary/30 border-border"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Address</label>
            <Input
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="bg-secondary/30 border-border"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border">
        <CardHeader>
          <CardTitle className="font-serif">Contact & Social</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">WhatsApp Number</label>
              <Input
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="bg-secondary/30 border-border"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Phone</label>
              <Input
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="bg-secondary/30 border-border"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email</label>
            <Input
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="bg-secondary/30 border-border"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Instagram</label>
              <Input
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="bg-secondary/30 border-border"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Facebook</label>
              <Input
                value={settings.facebook}
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                className="bg-secondary/30 border-border"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="bg-primary text-primary-foreground gap-2">
        <Save className="h-4 w-4" />
        Save Settings
      </Button>
    </div>
  );
};

export default AdminSettings;
