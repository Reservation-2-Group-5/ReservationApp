using Reservation.Models;
using ReservationApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Make sure to add the necessary using directives for data context or ORM

namespace ReservationApp.Services
{
    public class DeviceService : IDeviceService
    {
        // Assuming we are using Entity Framework Core, we would have a DbContext class for our database
        // Replace 'YourDbContext' with the actual name of your DbContext
        private readonly YourDbContext _context;

        public DeviceService(YourDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Device>> GetAllDevicesAsync()
        {
            // This would be an Entity Framework Core method call to get all devices
            return await _context.Devices.ToListAsync();
        }

        public async Task<Device> GetDeviceByTagAsync(int tag)
        {
            // Another Entity Framework Core method to find a single device by tag
            return await _context.Devices.FindAsync(tag);
        }

        public async Task<Device> CreateDeviceAsync(Device device)
        {
            _context.Devices.Add(device);
            await _context.SaveChangesAsync();
            return device;
        }

        public async Task UpdateDeviceAsync(Device device)
        {
            _context.Entry(device).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDeviceAsync(int tag)
        {
            var device = await _context.Devices.FindAsync(tag);
            if (device != null)
            {
                _context.Devices.Remove(device);
                await _context.SaveChangesAsync();
            }
        }
    }

    public class DeviceResService : IDeviceResService
    {
        private readonly YourDbContext _context; // Replace 'YourDbContext' with your actual DbContext

        public DeviceResService(YourDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DeviceRes>> GetAllDeviceReservationsAsync()
        {
            // Retrieve all device reservations from the database
            return await _context.DeviceRes.ToListAsync();
        }

        public async Task<DeviceRes> GetDeviceReservationByIdAsync(int id)
        {
            // Find a single device reservation by id
            return await _context.DeviceRes.FindAsync(id);
        }

        public async Task<DeviceRes> CreateDeviceReservationAsync(DeviceRes deviceRes)
        {
            // Add a new device reservation to the database
            _context.DeviceRes.Add(deviceRes);
            await _context.SaveChangesAsync();
            return deviceRes;
        }

        public async Task UpdateDeviceReservationAsync(DeviceRes deviceRes)
        {
            // Update an existing device reservation
            _context.Entry(deviceRes).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteDeviceReservationAsync(int id)
        {
            // Delete a device reservation by id
            var deviceRes = await _context.DeviceRes.FindAsync(id);
            if (deviceRes != null)
            {
                _context.DeviceRes.Remove(deviceRes);
                await _context.SaveChangesAsync();
            }
        }
    }
}
