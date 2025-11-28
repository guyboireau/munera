import { useForm } from 'react-hook-form';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CheckoutForm {
    email: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

const CheckoutPage = () => {
    const { cart, cartTotal } = useCart();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>();

    const onSubmit = (data: CheckoutForm) => {
        console.log("Checkout data:", data);
        // Proceed to payment
        alert("Proceeding to payment... (Stripe integration pending)");
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                    <button onClick={() => navigate('/shop')} className="text-orange-500 hover:underline">Return to Shop</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Form */}
                    <div>
                        <h2 className="text-xl font-bold mb-6">Delivery Details</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Email</label>
                                <input {...register('email', { required: true })} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:outline-none focus:border-orange-500" />
                                {errors.email && <span className="text-red-500 text-xs">Required</span>}
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Full Name</label>
                                <input {...register('name', { required: true })} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:outline-none focus:border-orange-500" />
                                {errors.name && <span className="text-red-500 text-xs">Required</span>}
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Address</label>
                                <input {...register('address', { required: true })} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:outline-none focus:border-orange-500" />
                                {errors.address && <span className="text-red-500 text-xs">Required</span>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">City</label>
                                    <input {...register('city', { required: true })} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:outline-none focus:border-orange-500" />
                                    {errors.city && <span className="text-red-500 text-xs">Required</span>}
                                </div>
                                <div>
                                    <label className="block text-sm text-zinc-400 mb-1">Postal Code</label>
                                    <input {...register('postalCode', { required: true })} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:outline-none focus:border-orange-500" />
                                    {errors.postalCode && <span className="text-red-500 text-xs">Required</span>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-400 mb-1">Country</label>
                                <input {...register('country', { required: true })} className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded text-white focus:outline-none focus:border-orange-500" />
                                {errors.country && <span className="text-red-500 text-xs">Required</span>}
                            </div>

                            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded mt-6 transition-colors">
                                Continue to Payment
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-zinc-900 p-6 rounded-xl h-fit border border-zinc-800">
                        <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            {cart.map((item, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-zinc-800 rounded overflow-hidden">
                                            {item.images && item.images[0] && <img src={item.images[0]} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{item.name}</p>
                                            <p className="text-xs text-zinc-500">
                                                Size: {item.selectedSize} | Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-bold">{(item.price * item.quantity).toFixed(2)} €</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-zinc-800 pt-4 flex justify-between items-center text-xl font-bold">
                            <span>Total</span>
                            <span>{cartTotal.toFixed(2)} €</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
