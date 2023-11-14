using ReservationApp.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReservationApp.Services
{
    public interface IDeviceResService
    {
        Task<IEnumerable<DeviceRes>> GetAllDeviceReservationsAsync();
        Task<DeviceRes> GetDeviceReservationByIdAsync(int id);
        Task<DeviceRes> CreateDeviceReservationAsync(DeviceRes deviceRes);
        Task UpdateDeviceReservationAsync(DeviceRes deviceRes);
        Task DeleteDeviceReservationAsync(int id);
    }
}