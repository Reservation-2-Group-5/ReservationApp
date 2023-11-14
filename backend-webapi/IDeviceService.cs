using Reservation.Models;
using ReservationApp.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReservationApp.Services
{
    public interface IDeviceService
    {
        Task<IEnumerable<Device>> GetAllDevicesAsync();
        Task<Device> GetDeviceByTagAsync(int tag);
        Task<Device> CreateDeviceAsync(Device device);
        Task UpdateDeviceAsync(Device device);
        Task DeleteDeviceAsync(int tag);
    }
}
