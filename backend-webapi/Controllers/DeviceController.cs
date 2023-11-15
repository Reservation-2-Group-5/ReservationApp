using Microsoft.AspNetCore.Mvc;
using Reservation.Models;
using ReservationApp.Models;
using ReservationApp.Services; 
using System.Collections.Generic;
using System.Threading.Tasks; //Need to redo this one

namespace ReservationApp.Controllers
{
    [Route("api/v1/device")]
    [ApiController]
    public class DeviceController : ControllerBase
    {
        private readonly IDeviceService _deviceService;

        public DeviceController(IDeviceService deviceService)
        {
            _deviceService = deviceService;
        }

        // GET: api/Device
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Device>>> GetDevices()
        {
            return Ok(await _deviceService.GetAllDevicesAsync());
        }

        // GET: api/Device/5
        [HttpGet("{tag}")]
        public async Task<ActionResult<Device>> GetDevice(int tag)
        {
            var device = await _deviceService.GetDeviceByTagAsync(tag);

            if (device == null)
            {
                return NotFound();
            }

            return device;
        }

        // POST: api/Device
        [HttpPost]
        public async Task<ActionResult<Device>> PostDevice([FromBody] Device device)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdDevice = await _deviceService.CreateDeviceAsync(device);
            return CreatedAtAction(nameof(GetDevice), new { tag = createdDevice.Tag }, createdDevice);
        }

        // PUT: api/Device/5
        [HttpPut("{tag}")]
        public async Task<IActionResult> PutDevice(int tag, [FromBody] Device device)
        {
            if (tag != device.Tag)
            {
                return BadRequest();
            }

            try
            {
                await _deviceService.UpdateDeviceAsync(device);
            }
            catch
            {
                // Add logic to check if the device actually exists and handle accordingly
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Device/5
        [HttpDelete("{tag}")]
        public async Task<IActionResult> DeleteDevice(int tag)
        {
            var device = await _deviceService.GetDeviceByTagAsync(tag);
            if (device == null)
            {
                return NotFound();
            }

            await _deviceService.DeleteDeviceAsync(tag);
            return NoContent();
        }
    }
}
