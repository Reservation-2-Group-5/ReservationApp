using Microsoft.AspNetCore.Mvc;
using ReservationApp.Models;
using ReservationApp.Services; 
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReservationApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceResController : ControllerBase
    {
        private readonly IDeviceResService _deviceResService;

        public DeviceResController(IDeviceResService deviceResService)
        {
            _deviceResService = deviceResService;
        }

        // GET: api/DeviceRes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeviceRes>>> GetDeviceReservations()
        {
            return Ok(await _deviceResService.GetAllDeviceReservationsAsync());
        }

        // GET: api/DeviceRes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DeviceRes>> GetDeviceReservation(int id)
        {
            var deviceReservation = await _deviceResService.GetDeviceReservationByIdAsync(id);
            if (deviceReservation == null)
            {
                return NotFound();
            }
            return deviceReservation;
        }

        // POST: api/DeviceRes
        [HttpPost]
        public async Task<ActionResult<DeviceRes>> PostDeviceReservation([FromBody] DeviceRes deviceRes)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdDeviceRes = await _deviceResService.CreateDeviceReservationAsync(deviceRes);
            return CreatedAtAction(nameof(GetDeviceReservation), new { id = createdDeviceRes.Id }, createdDeviceRes);
        }

        // PUT: api/DeviceRes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDeviceReservation(int id, [FromBody] DeviceRes deviceRes)
        {
            if (id != deviceRes.Id)
            {
                return BadRequest();
            }

            try
            {
                await _deviceResService.UpdateDeviceReservationAsync(deviceRes);
            }
            catch
            {
                // Add logic to check if the device reservation actually exists
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/DeviceRes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeviceReservation(int id)
        {
            var deviceReservation = await _deviceResService.GetDeviceReservationByIdAsync(id);
            if (deviceReservation == null)
            {
                return NotFound();
            }

            await _deviceResService.DeleteDeviceReservationAsync(id);
            return NoContent();
        }
    }
}