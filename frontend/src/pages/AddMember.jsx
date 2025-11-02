import React, { useState, useRef, useEffect } from 'react';
import { UserPlus, Check, Camera, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { addMember } from '../mock';
import { useToast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const defaultPlans = [
  { name: 'Basic (3 Months)', price: 4500, duration: 3 },
  { name: 'Standard (6 Months)', price: 9000, duration: 6 },
  { name: 'Premium (12 Months)', price: 15000, duration: 12 }
];

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    contact: '',
    plan: '',
    joinDate: new Date().toISOString().split('T')[0],
    fees: '',
    photo: null
  });

  const [plans, setPlans] = useState(defaultPlans);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', price: '', duration: '' });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load custom plans from localStorage
  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem('customPlans')) || [];
    setPlans([...defaultPlans, ...savedPlans]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlanChange = (planName) => {
    const selectedPlan = plans.find((p) => p.name === planName);
    if (selectedPlan) {
      const joinDate = new Date(formData.joinDate);
      const dueDate = new Date(joinDate);
      dueDate.setMonth(dueDate.getMonth() + selectedPlan.duration);
      setFormData((prev) => ({
        ...prev,
        plan: planName,
        fees: selectedPlan.price.toString(),
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: URL.createObjectURL(file)
      }));
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch {
      toast({
        title: 'Camera Access Denied',
        description: 'Please allow camera permissions.',
        variant: 'destructive'
      });
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoUrl = canvas.toDataURL('image/png');
    setFormData((prev) => ({
      ...prev,
      photo: photoUrl
    }));
    stopCamera();
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraActive(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.contact || !formData.plan || !formData.email) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }

    const memberData = {
      ...formData,
      age: parseInt(formData.age),
      fees: parseInt(formData.fees),
      paymentStatus: 'paid',
      lastPayment: formData.joinDate
    };

    const newMember = addMember(memberData);
    setShowSuccess(true);

    toast({
      title: 'Member Added Successfully!',
      description: `${newMember.name} has been added with ID: ${newMember.id}`
    });

    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        name: '',
        age: '',
        email: '',
        contact: '',
        plan: '',
        joinDate: new Date().toISOString().split('T')[0],
        fees: '',
        photo: null
      });
    }, 2000);
  };

  const handleAddPlan = () => {
    if (!newPlan.name || !newPlan.price || !newPlan.duration) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill all custom plan details.',
        variant: 'destructive'
      });
      return;
    }

    const customPlan = {
      name: newPlan.name,
      price: parseInt(newPlan.price),
      duration: parseInt(newPlan.duration)
    };

    const updatedPlans = [...plans, customPlan];
    setPlans(updatedPlans);
    localStorage.setItem('customPlans', JSON.stringify(updatedPlans.filter(p => !defaultPlans.some(dp => dp.name === p.name))));

    toast({
      title: 'New Plan Added!',
      description: `${customPlan.name} has been saved for future use.`
    });

    setNewPlan({ name: '', price: '', duration: '' });
    setShowAddPlan(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {showSuccess && (
        <Card className="shadow-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="py-6">
            <div className="flex items-center space-x-3">
              <Check className="h-8 w-8" />
              <div>
                <h3 className="text-xl font-bold">Member Added Successfully!</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <UserPlus className="h-8 w-8" />
            <div>
              <CardTitle className="text-2xl">Add New Member</CardTitle>
              <p className="text-orange-100">Register a new gym member</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label>Age *</Label>
                <Input name="age" type="number" value={formData.age} onChange={handleInputChange} required />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label>Email ID *</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label>Contact Number *</Label>
                <Input name="contact" type="tel" value={formData.contact} onChange={handleInputChange} required />
              </div>

              {/* Plan */}
              <div className="space-y-2">
                <Label>Membership Plan *</Label>
                <Select onValueChange={handlePlanChange} value={formData.plan}>
                  <SelectTrigger><SelectValue placeholder="Select a plan" /></SelectTrigger>
                  <SelectContent>
                    {plans.map((plan) => (
                      <SelectItem key={plan.name} value={plan.name}>
                        {plan.name} - ₹{plan.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowAddPlan(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Custom Plan
                </Button>
              </div>

              {/* Join Date */}
              <div className="space-y-2">
                <Label>Joining Date *</Label>
                <Input type="date" name="joinDate" value={formData.joinDate} onChange={handleInputChange} />
              </div>

              {/* Fees */}
              <div className="space-y-2">
                <Label>Membership Fees *</Label>
                <Input name="fees" readOnly value={formData.fees} className="bg-gray-100" />
              </div>

              {/* Photo */}
              <div className="space-y-2">
                <Label>Photo</Label>
                <div className="flex items-center gap-3">
                  <Button type="button" onClick={startCamera} variant="secondary">
                    <Camera className="mr-2 h-5 w-5" /> Take Photo
                  </Button>
                  <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
                </div>
                {formData.photo && (
                  <img src={formData.photo} alt="Member" className="w-32 h-32 object-cover rounded-lg mt-3 border" />
                )}
              </div>
            </div>

            {cameraActive && (
              <div className="flex flex-col items-center space-y-3 mt-4">
                <video ref={videoRef} autoPlay className="w-64 rounded-lg border" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-3">
                  <Button onClick={capturePhoto} type="button">Capture</Button>
                  <Button onClick={stopCamera} variant="outline" type="button">Cancel</Button>
                </div>
              </div>
            )}

            {showAddPlan && (
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg mt-6 space-y-3 border border-orange-300">
                <h4 className="font-semibold">Add Custom Plan</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input
                    placeholder="Plan Name"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan((p) => ({ ...p, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Duration (Months)"
                    type="number"
                    value={newPlan.duration}
                    onChange={(e) => setNewPlan((p) => ({ ...p, duration: e.target.value }))}
                  />
                  <Input
                    placeholder="Price (₹)"
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan((p) => ({ ...p, price: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3 mt-3">
                  <Button type="button" onClick={handleAddPlan}>Save Plan</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddPlan(false)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <UserPlus className="mr-2 h-5 w-5" /> Add Member
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate('/')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddMember;
